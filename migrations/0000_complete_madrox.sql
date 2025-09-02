CREATE TYPE "public"."app_permission" AS ENUM('users:create', 'users:read', 'users:update', 'users:delete');--> statement-breakpoint
CREATE TYPE "public"."app_role" AS ENUM('admin', 'developer', 'buyer');--> statement-breakpoint

create or replace function public.authorize(
  requested_permission app_permission
)
returns boolean as $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;
$$ language plpgsql stable security definer set search_path = '';


CREATE TABLE "role_permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "role_permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" "app_role" NOT NULL,
	"permission" "app_permission" NOT NULL,
	CONSTRAINT "role_permissions_role_unique" UNIQUE("role"),
	CONSTRAINT "role_permissions_role_permission_unique" UNIQUE("role","permission")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"role" "app_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "user_roles users:read" ON "user_roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select authorize('users:read')));--> statement-breakpoint
CREATE POLICY "user_roles users:create" ON "user_roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select authorize('users:create')));--> statement-breakpoint
CREATE POLICY "user_roles users:update" ON "user_roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select authorize('users:update'))) WITH CHECK ((select authorize('users:update')));--> statement-breakpoint
CREATE POLICY "user_roles users:delete" ON "user_roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select authorize('users:delete')));--> statement-breakpoint
CREATE POLICY "users:read" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select authorize('users:read')));--> statement-breakpoint
CREATE POLICY "users:create" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select authorize('users:create')));--> statement-breakpoint
CREATE POLICY "users:update" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select authorize('users:update'))) WITH CHECK ((select authorize('users:update')));--> statement-breakpoint
CREATE POLICY "users:delete" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select authorize('users:delete')));