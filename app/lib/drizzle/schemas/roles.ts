import { sql } from 'drizzle-orm';
import {
	pgTable,
	pgPolicy,
	integer,
	uuid,
	pgEnum
} from 'drizzle-orm/pg-core';
import { authUsers, authenticatedRole } from 'drizzle-orm/supabase';

export const appRolesEnum = pgEnum('app_role', [
	'admin',
	'developer',
	'buyer'
]);

export const user_roles = pgTable(
	'user_roles',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		user_id: uuid()
			.references(() => authUsers.id, { onDelete: 'cascade' })
			.notNull(),
		role: appRolesEnum().notNull()
	},
	(t) => [
		pgPolicy('user_roles users:read', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'select',
			using: sql`(select authorize('users:read'))`
		}),
		pgPolicy('user_roles users:create', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'insert',
			withCheck: sql`(select authorize('users:create'))`
		}),
		pgPolicy('user_roles users:update', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'update',
			using: sql`(select authorize('users:update'))`,
			withCheck: sql`(select authorize('users:update'))`
		}),
		pgPolicy('user_roles users:delete', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'delete',
			using: sql`(select authorize('users:delete'))`
		})
	]
);
