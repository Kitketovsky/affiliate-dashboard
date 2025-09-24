import { pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema
} from 'drizzle-zod';
import z from 'zod';

export const serviceCategoryEnum = pgEnum('service_category', [
	'domain',
	'storage',
	'vps',
	'tracker'
]);

export const serviceProviderEnum = pgEnum('service_provider', [
	// domain
	'namesilo',
	'internet_bs',
	'dynodot',
	// tracker
	'keitaro',
	// storate
	'dropbox',
	// vps
	'digital_ocean'
]);

export const services = pgTable(
	'services',
	{
		id: uuid().primaryKey().defaultRandom(),
		category: serviceCategoryEnum().notNull(),
		name: serviceProviderEnum().notNull()
	},
	(t) => [unique().on(t.category, t.name)]
);

export const zServicesSelect = createSelectSchema(services);
export const zServicesInsert = createInsertSchema(services);
export const zServicesUpdate = createUpdateSchema(services)
	.omit({ id: true })
	.extend({ id: z.string() });

export type ServicesSelect = z.infer<typeof zServicesSelect>;
export type ServicesInsert = z.infer<typeof zServicesInsert>;
export type ServicesUpdate = z.infer<typeof zServicesUpdate>;
