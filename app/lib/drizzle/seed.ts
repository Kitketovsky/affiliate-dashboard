import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/envalid';

async function seedSupabaseUsers() {
	const supabase = createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.SUPABASE_SERVICE_ROLE_KEY
	);

	const { data: usersData } = await supabase.auth.admin.listUsers();

	const seedUsers = [
		{ email: 'test@test.com', password: 'testtest' }
	];

	for (const user of seedUsers) {
		const foundUser = usersData.users.find(
			({ email }) => email === user.email
		);

		if (foundUser) {
			const { error } = await supabase.auth.admin.deleteUser(
				foundUser.id
			);

			if (error) throw new Error(error.message);
		}

		const { error } = await supabase.auth.admin.createUser({
			email: user.email,
			password: user.password,
			email_confirm: true
		});

		if (error) {
			throw new Error(error.message);
		}
	}

	process.exit(0);
}

seedSupabaseUsers().catch(console.error);
