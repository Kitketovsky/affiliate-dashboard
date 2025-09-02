import { createBrowserClient } from '@supabase/ssr';
import { env } from './../../../envalid';
import { db } from '.';
import { role_permissions } from './schemas/permissions';
import { user_roles } from './schemas/roles';

async function seedSupabaseUsers() {
	const supabase = createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.SUPABASE_SERVICE_ROLE_KEY
	);

	const { data: usersData } = await supabase.auth.admin.listUsers();

	const adminUser = { email: 'test@test.com', password: 'testtest' };

	const foundUser = usersData.users.find(
		({ email }) => email === adminUser.email
	);

	if (foundUser) {
		const { error } = await supabase.auth.admin.deleteUser(
			foundUser.id
		);

		if (error) {
			throw new Error(error.message);
		}
	}

	const { error, data: adminUserData } =
		await supabase.auth.admin.createUser({
			email: adminUser.email,
			password: adminUser.password,
			email_confirm: true
		});

	if (error) {
		throw new Error(error.message);
	}

	await db
		.insert(user_roles)
		.values({ user_id: adminUserData.user.id, role: 'admin' })
		.onConflictDoNothing();

	await db
		.insert(role_permissions)
		.values([
			{ role: 'admin', permission: 'users:create' },
			{ role: 'admin', permission: 'users:read' },
			{ role: 'admin', permission: 'users:update' },
			{ role: 'admin', permission: 'users:delete' }
		])
		.onConflictDoNothing();
}

seedSupabaseUsers()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
