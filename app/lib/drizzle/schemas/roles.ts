import { pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';
import z from 'zod';
import { users } from './users';

export const appRolesEnum = pgEnum('app_role', [
	'admin',
	'developer',
	'buyer'
]);

export const roles = pgTable('roles', {
	id: uuid().primaryKey().defaultRandom(),
	role: appRolesEnum().notNull().unique()
});

export const user_roles = pgTable('user_roles', {
	id: uuid().primaryKey().defaultRandom(),
	user_id: uuid()
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	role_id: uuid()
		.references(() => roles.id, { onDelete: 'cascade' })
		.notNull()
});

export const zRolesSelect = createSelectSchema(roles);
export const zRolesInsert = createInsertSchema(roles)
	.omit({ id: true })
	.extend({ id: z.string() });
export const zRolesUpdate = createUpdateSchema(roles);

export type RolesSelect = z.infer<typeof zRolesSelect>;
export type RolesInsert = z.infer<typeof zRolesInsert>;
export type RolesUpdate = z.infer<typeof zRolesUpdate>;

export const zUserRolesInsert = createInsertSchema(user_roles);
export const zUserRolesUpdate = createUpdateSchema(user_roles)
	.omit({ id: true })
	.extend({ id: z.string() });
export const zUserRolesSelect = createSelectSchema(user_roles);

export type UserRolesSelect = z.infer<typeof zUserRolesSelect>;
export type UserRolesInsert = z.infer<typeof zUserRolesInsert>;
export type UserRolesUpdate = z.infer<typeof zUserRolesUpdate>;
