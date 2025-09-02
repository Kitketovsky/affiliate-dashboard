import {
	pgEnum,
	pgTable,
	integer,
	unique
} from 'drizzle-orm/pg-core';
import { appRolesEnum } from './roles';

export const appPermissionEnum = pgEnum('app_permission', [
	'users:create',
	'users:read',
	'users:update',
	'users:delete'
]);

export const role_permissions = pgTable(
	'role_permissions',
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		role: appRolesEnum().notNull().unique(),
		permission: appPermissionEnum().notNull()
	},
	(t) => [unique().on(t.role, t.permission)]
);
