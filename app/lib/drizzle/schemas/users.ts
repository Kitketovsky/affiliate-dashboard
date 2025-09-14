import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const users = pgTable('users', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	email: varchar({ length: 255 }).unique().notNull()
});

const zUsers = createSelectSchema(users);

export type UsersSelect = z.infer<typeof zUsers>;
