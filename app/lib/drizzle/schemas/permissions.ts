import { pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const permissionsResourceEnum = pgEnum(
	'permissions_resource',
	['users', 'roles', 'campaigns', 'queues']
);

export const permissionsActionsEnum = pgEnum('permissions_action', [
	'create',
	'read',
	'update',
	'delete'
]);

export const permissions = pgTable(
	'permissions',
	{
		id: uuid().primaryKey().defaultRandom(),
		resource: permissionsResourceEnum().notNull(),
		action: permissionsActionsEnum().notNull()
	},
	(t) => [unique().on(t.resource, t.action)]
);

export const role_permissions = pgTable(
	'role_permissions',
	{
		id: uuid().primaryKey().defaultRandom(),
		role_id: uuid().references(() => roles.id, {
			onDelete: 'cascade'
		}),
		permission_id: uuid().references(() => permissions.id, {
			onDelete: 'cascade'
		})
	},
	(t) => [unique().on(t.role_id, t.permission_id)]
);

export const zPermissions = createSelectSchema(permissions);
export const zRolesEnum = createSelectSchema(role_permissions);

export type Permission = z.infer<typeof zPermissions>;
export type Role = z.infer<typeof zRolesEnum>;

export const zPermissionsAction = createSelectSchema(
	permissionsActionsEnum
);
export const zPermissionsResource = createSelectSchema(
	permissionsResourceEnum
);

export type PermissionAction = z.infer<typeof zPermissionsAction>;
export type PermissionResource = z.infer<typeof zPermissionsResource>;
