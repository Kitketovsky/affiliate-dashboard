'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../../../lib/drizzle';
import {
	providers,
	ProvidersUpdate
} from '../../../lib/drizzle/schemas/providers';
import { sql, eq, RequireAtLeastOne } from 'drizzle-orm';

export async function updateProvider({
	id,
	label,
	service_id,
	api_key
}: RequireAtLeastOne<ProvidersUpdate, 'id'>) {
	// If API key is provided, update it in the vault
	let api_key_id: string | undefined;

	if (api_key) {
		// Get the existing provider to find the current api_key_id
		const existingProvider = await db
			.select({ api_key_id: providers.api_key_id })
			.from(providers)
			.where(eq(providers.id, id))
			.limit(1);

		if (existingProvider.length === 0) {
			throw new Error('Provider not found');
		}

		// Update the existing secret in vault
		await db.execute(sql`
            SELECT vault.update_secret(${existingProvider[0].api_key_id}, ${api_key}, ${label});
		`);

		api_key_id = existingProvider[0].api_key_id;
	}

	// Update the provider
	await db
		.update(providers)
		.set({
			label,
			service_id,
			...(api_key_id && { api_key_id })
		})
		.where(eq(providers.id, id));

	revalidatePath('/main/settings');
}
