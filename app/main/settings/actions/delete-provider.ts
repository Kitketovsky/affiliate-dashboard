'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../../../lib/drizzle';
import {
	providers,
	ProvidersSelect
} from '../../../lib/drizzle/schemas/providers';
import { sql, eq } from 'drizzle-orm';

export async function deleteProvider(
	providerId: ProvidersSelect['id']
) {
	try {
		// First, get the provider to find the associated API key ID
		const providerData = await db
			.select({
				id: providers.id,
				api_key_id: providers.api_key_id
			})
			.from(providers)
			.where(eq(providers.id, providerId))
			.limit(1);

		if (providerData.length === 0) {
			throw new Error('Provider not found');
		}

		const { api_key_id } = providerData[0];

		// Delete the provider (this will cascade delete the API key due to foreign key constraint)
		// But let's also explicitly delete the secret from vault for good measure
		if (api_key_id) {
			await db.execute(sql`
				DELETE FROM vault.secrets
				WHERE id = ${api_key_id}
			`);
		}

		// Delete the provider
		await db.delete(providers).where(eq(providers.id, providerId));

		revalidatePath('/main/settings');

		return {
			success: true,
			message: 'Provider deleted successfully'
		};
	} catch (error) {
		console.error('Error deleting provider:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to delete provider'
		};
	}
}
