import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../../envalid';

export const db = drizzle({
	connection: env.NEXT_PUBLIC_SUPABASE_URL,
	casing: 'snake_case'
});
