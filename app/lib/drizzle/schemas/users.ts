import { sql } from 'drizzle-orm';
import {
	pgPolicy,
	pgTable,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { authUsers, authenticatedRole } from 'drizzle-orm/supabase';

export const users = pgTable(
	'users',
	{
		id: uuid()
			.primaryKey()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		email: varchar({ length: 255 }).unique().notNull()
	},
	(t) => [
		pgPolicy('users:read', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'select',
			using: sql`(select authorize('users:read'))`
		}),
		pgPolicy('users:create', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'insert',
			withCheck: sql`(select authorize('users:create'))`
		}),
		pgPolicy('users:update', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'update',
			using: sql`(select authorize('users:update'))`,
			withCheck: sql`(select authorize('users:update'))`
		}),
		pgPolicy('users:delete', {
			as: 'permissive',
			to: authenticatedRole,
			for: 'delete',
			using: sql`(select authorize('users:delete'))`
		})
	]
);
