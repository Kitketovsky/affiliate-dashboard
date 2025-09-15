import { createBrowserClient } from '@supabase/ssr';
import { env } from './../../../envalid';
import { db } from '.';
import {
	permissions,
	permissionsActionsEnum,
	permissionsResourceEnum,
	role_permissions
} from './schemas/permissions';
import { roles, user_roles } from './schemas/roles';
import { services } from './schemas/services';

async function seedSupabaseUsers() {
	const supabase = createBrowserClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.SUPABASE_SERVICE_ROLE_KEY
	);

	const { data: usersData } = await supabase.auth.admin.listUsers();

	const TEST_USER = {
		email: 'test@test.com',
		password: 'testtest'
	};

	const foundUser = usersData.users.find(
		({ email }) => email === TEST_USER.email
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
			...TEST_USER,
			email_confirm: true
		});

	if (error) {
		throw new Error(error.message);
	}

	const rolesData = await db
		.insert(roles)
		.values([
			{ role: 'admin' },
			{ role: 'developer' },
			{ role: 'buyer' }
		])
		.returning()
		.onConflictDoNothing();

	const adminRole = rolesData.find(({ role }) => role === 'admin')!;

	await db
		.insert(user_roles)
		.values({
			user_id: adminUserData.user.id,
			role_id: adminRole.id
		})
		.onConflictDoNothing();

	const adminPermissions = await db
		.insert(permissions)
		.values(createAdminPermissions())
		.returning()
		.onConflictDoNothing();

	await db
		.insert(role_permissions)
		.values(
			adminPermissions.map(({ id }) => ({
				role_id: adminRole.id,
				permission_id: id
			}))
		)
		.onConflictDoNothing();

	await db
		.insert(services)
		.values([
			{ category: 'tracker', name: 'keitaro' },
			{ category: 'domain', name: 'namesilo' },
			{ category: 'domain', name: 'internet_bs' },
			{ category: 'domain', name: 'dynodot' },
			{ category: 'storage', name: 'dropbox' },
			{ category: 'vps', name: 'digital_ocean' }
		])
		.onConflictDoNothing();
}

function createAdminPermissions() {
	const result = [];

	for (const resource of permissionsResourceEnum.enumValues) {
		for (const action of permissionsActionsEnum.enumValues) {
			result.push({ resource, action });
		}
	}

	return result;
}

seedSupabaseUsers()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
