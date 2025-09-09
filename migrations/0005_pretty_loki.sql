CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"role" "app_role" NOT NULL,
	CONSTRAINT "roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "roles users:read" ON "roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select authorize('users:read')));--> statement-breakpoint
CREATE POLICY "roles users:create" ON "roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select authorize('users:create')));--> statement-breakpoint
CREATE POLICY "roles users:update" ON "roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select authorize('users:update'))) WITH CHECK ((select authorize('users:update')));--> statement-breakpoint
CREATE POLICY "roles users:delete" ON "roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select authorize('users:delete')));