'use server';

import { revalidatePath } from 'next/cache';
import { db } from '../../../lib/drizzle';
import {
	ProvidersInsert,
	providers
} from '../../../lib/drizzle/schemas/providers';
import { sql } from 'drizzle-orm';

export async function createProvider({
	api_key,
	label,
	service_id
}: ProvidersInsert) {
	const [{ create_secret }] = (await db.execute(sql`
		select vault.create_secret(${api_key}, ${label})
	`)) as { create_secret: string }[];

	await db.insert(providers).values({
		service_id,
		label,
		api_key_id: create_secret
	});

	revalidatePath('/main/settings');
}
