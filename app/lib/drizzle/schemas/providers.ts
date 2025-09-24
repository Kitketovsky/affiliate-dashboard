import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { services } from './services';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';
import z from 'zod';
import { secrets } from '../ignored_schemas/vault';

export const providers = pgTable('providers', {
	id: uuid().primaryKey().defaultRandom(),
	api_key_id: uuid()
		.notNull()
		.references(() => secrets.id, { onDelete: 'cascade' }),
	label: varchar().notNull(),
	service_id: uuid()
		.notNull()
		.references(() => services.id, { onDelete: 'cascade' })
});

export const zProvidersSelect = createSelectSchema(providers);
export const zProvidersInsert = createInsertSchema(providers)
	.omit({ api_key_id: true })
	.extend({ api_key: z.string() });
export const zProvidersUpdate = createUpdateSchema(providers)
	.omit({ api_key_id: true })
	.extend({ api_key: z.string() });

export type ProvidersSelect = z.infer<typeof zProvidersSelect>;
export type ProvidersInsert = z.infer<typeof zProvidersInsert>;
export type ProvidersUpdate = z.infer<typeof zProvidersUpdate>;
