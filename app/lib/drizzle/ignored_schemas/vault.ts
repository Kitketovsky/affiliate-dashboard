import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

// Supabase Vault - extension to store encrypted secrets and other data
// https://supabase.com/docs/guides/database/vault

export const vault = pgSchema('vault');

export const secrets = vault.table('secrets', {
	id: uuid().primaryKey().defaultRandom(),
	name: text(),
	description: text(),
	secret: text().notNull()
});
