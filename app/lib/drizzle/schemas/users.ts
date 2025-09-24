import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import {
	createSelectSchema,
	createInsertSchema,
	createUpdateSchema
} from 'drizzle-zod';
import z from 'zod';

export const users = pgTable('users', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	email: varchar({ length: 255 }).unique().notNull()
});

export const zUsersSelect = createSelectSchema(users);
export const zUsersInsert = createInsertSchema(users);
export const zUsersUpdate = createUpdateSchema(users)
	.omit({ id: true })
	.extend({ id: z.string() });

export type UsersSelect = z.infer<typeof zUsersSelect>;
export type UsersInsert = z.infer<typeof zUsersInsert>;
export type UsersUpdate = z.infer<typeof zUsersUpdate>;
