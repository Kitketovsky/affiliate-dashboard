import { eq } from 'drizzle-orm';
import { db } from '../../lib/drizzle';
import { users, UsersData } from '../../lib/drizzle/schemas/users';
import { getUserRoleAndPermissions } from '../../lib/supabase/server';
import {
	roles as roles_table,
	user_roles
} from '../../lib/drizzle/schemas/roles';
import { UsersTable } from './tables/users-table';

export default async function Users() {
	const { role, hasPermission } = await getUserRoleAndPermissions();

	const data: UsersData[] = await db
		.select({
			id: users.id,
			email: users.email,
			role: user_roles.role
		})
		.from(users)
		.leftJoin(user_roles, eq(users.id, user_roles.user_id));

	const roles = await db.select().from(roles_table);

	return <UsersTable data={data} roles={roles} />;
}
