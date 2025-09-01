import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './envalid';

export default defineConfig({
	out: './drizzle/migrations',
	schema: './drizzle/schemas/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.SUPABASE_DATABASE_URL
	}
});
