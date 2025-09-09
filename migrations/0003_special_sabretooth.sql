ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_unique";--> statement-breakpoint
ALTER POLICY "user_roles users:delete" ON "user_roles" TO authenticated USING ((select authorize('users:delete')));--> statement-breakpoint
ALTER POLICY "users:delete" ON "users" TO authenticated USING ((select authorize('users:delete')));