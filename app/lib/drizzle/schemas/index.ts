import { sql } from 'drizzle-orm';
import {
	integer,
	pgEnum,
	pgPolicy,
	pgTable,
	uuid
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase';

// Supabase Role Based Access Control
// https://supabase.com/docs/guides/database/postgres/row-level-security

export const usersRolesEnum = pgEnum('role', [
	'admin',
	'developer',
	'buyer'
]);

export const usersRolesTable = pgTable(
	'users_roles',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		user_id: uuid()
			.references(() => authUsers.id)
			.notNull(),
		role: usersRolesEnum().notNull()
	},
	(t) => [
		pgPolicy('policy', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'all',
			using: sql``,
			withCheck: sql``
		})
	]
);

export const usersPermissionsEnum = pgEnum('permissions', [
	'users:create',
	'users:read',
	'users:update',
	'users:delete'
]);

export const rolePermissionsTable = pgTable('permissions', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	role: usersRolesEnum().notNull().unique(),
	permission: usersPermissionsEnum().notNull().unique()
});
