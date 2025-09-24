import { eq } from 'drizzle-orm';
import { db } from '../../lib/drizzle';
import { providers } from '../../lib/drizzle/schemas/providers';
import { services } from '../../lib/drizzle/schemas/services';
import { ProvidersTable } from './tables/providers/providers-table';
import { secrets } from '../../lib/drizzle/ignored_schemas/vault';

export type ServicesData = Awaited<ReturnType<typeof getServices>>;

async function getServices() {
	const data = await db.select().from(services);

	const grouped = Object.groupBy(data, ({ category }) => category);

	// !FIXME: only plain objects nextjs error
	return JSON.parse(JSON.stringify(grouped)) as typeof grouped;
}

export type ProvidersData = Awaited<ReturnType<typeof getProviders>>;

async function getProviders() {
	return await db
		.select({
			id: providers.id,
			label: providers.label,
			api_key: {
				id: secrets.id,
				name: secrets.name,
				key: secrets.secret
			},
			service: {
				id: services.id,
				category: services.category,
				name: services.name
			}
		})
		.from(providers)
		.leftJoin(services, eq(providers.service_id, services.id))
		.leftJoin(secrets, eq(providers.api_key_id, secrets.id));
}

export default async function SettingsPage() {
	const [servicesData, providersData] = await Promise.all([
		getServices(),
		getProviders()
	]);

	return (
		<ProvidersTable data={providersData} services={servicesData} />
	);
}
