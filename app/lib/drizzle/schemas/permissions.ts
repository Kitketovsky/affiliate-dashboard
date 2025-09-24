import { pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';
import z from 'zod';

export const permissionsResourceEnum = pgEnum(
	'permissions_resource',
	['users', 'roles', 'campaigns', 'queues', 'settings']
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

export const zPermissionsSelect = createSelectSchema(permissions);
export const zPermissionsInsert = createInsertSchema(permissions);
export const zPermissionsUpdate = createUpdateSchema(permissions)
	.omit({ id: true })
	.extend({ id: z.string() });

export type PermissionsSelect = z.infer<typeof zPermissionsSelect>;
export type PermissionsInsert = z.infer<typeof zPermissionsInsert>;
export type PermissionsUpdate = z.infer<typeof zPermissionsUpdate>;

export const zRolePermissionsSelect =
	createSelectSchema(role_permissions);
export const zRolePermissionsInsert =
	createInsertSchema(role_permissions);
export const zRolePermissionsUpdate = createUpdateSchema(
	role_permissions
)
	.omit({ id: true })
	.extend({ id: z.string() });

export type RolePermissionsSelect = z.infer<
	typeof zRolePermissionsSelect
>;
export type RolePermissionsInsert = z.infer<
	typeof zRolePermissionsInsert
>;
export type RolePermissionsUpdate = z.infer<
	typeof zRolePermissionsUpdate
>;
