import { eq } from 'drizzle-orm';
import { db } from '../../lib/drizzle';
import { users } from '../../lib/drizzle/schemas/users';
import { roles, user_roles } from '../../lib/drizzle/schemas/roles';
import { UsersTable } from './tables/users-table';
import { hasAuthority } from '../../lib/supabase/server';

export type UsersData = Awaited<ReturnType<typeof getUsers>>;

export async function getUsers() {
	return await db
		.select({
			id: users.id,
			email: users.email,
			role: {
				id: roles.id,
				role: roles.role
			}
		})
		.from(users)
		.leftJoin(user_roles, eq(users.id, user_roles.user_id))
		.leftJoin(roles, eq(user_roles.role_id, roles.id));
}

export default async function Users() {
	const isAuthorized = await hasAuthority('users', 'read');

	if (!isAuthorized) {
		return <div>You are not allowed to see this page</div>;
	}

	const usersData = await getUsers();

	// !FIXME: rolesData is needed only when ChangeRole dialog is opened
	const rolesData = await db.select().from(roles);

	return <UsersTable data={usersData} roles={rolesData} />;
}
