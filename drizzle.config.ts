import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './envalid';

export default defineConfig({
	out: './migrations',
	schema: ['app/lib/drizzle/schemas'],
	dialect: 'postgresql',
	dbCredentials: {
		url: env.SUPABASE_DATABASE_URL
	}
});
