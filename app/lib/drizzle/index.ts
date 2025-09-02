import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from './../../../envalid';

export const db = drizzle({
	connection: env.SUPABASE_DATABASE_URL,
	casing: 'snake_case'
});
