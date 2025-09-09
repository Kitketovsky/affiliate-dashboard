import { cleanEnv, str, url } from 'envalid';

// Client envs are not discoverable via 'envalid' -> use process.env
// https://github.com/af/envalid/issues/168#issuecomment-1307233698

export const env = cleanEnv(process.env, {
	SUPABASE_DATABASE_URL: url({
		example: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
	}),
	NEXT_PUBLIC_SUPABASE_URL: url(),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: str(),
	SUPABASE_SERVICE_ROLE_KEY: str()
});
