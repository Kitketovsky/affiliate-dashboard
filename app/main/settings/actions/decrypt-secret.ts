'use server';

import { db } from '../../../lib/drizzle';
import { sql } from 'drizzle-orm';

export async function decryptSecret(secretId: string) {
	try {
		const result = await db.execute(sql`
			SELECT decrypted_secret
			FROM vault.decrypted_secrets
			WHERE id = ${secretId}
		`);

		if (!result || result.length === 0) {
			throw new Error('Secret not found');
		}

		const decryptedSecret = result[0] as { decrypted_secret: string };

		return {
			success: true,
			decryptedSecret: decryptedSecret.decrypted_secret
		};
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to decrypt secret'
		};
	}
}
