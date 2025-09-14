import { pgTable, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
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

export const zUserRoles = createSelectSchema(user_roles);
export const zRolesEnum = createSelectSchema(appRolesEnum);
export const zRoles = createSelectSchema(roles);

export type UserRolesSelect = z.infer<typeof zUserRoles>;
export type RolesSelect = z.infer<typeof zRoles>;
export type Role = z.infer<typeof zRolesEnum>;
