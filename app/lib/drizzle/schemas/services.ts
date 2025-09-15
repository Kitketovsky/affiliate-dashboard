import { pgEnum, pgTable, unique, uuid } from 'drizzle-orm/pg-core';

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
