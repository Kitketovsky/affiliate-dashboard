'use server';

import { db } from '../../../lib/drizzle';
import {
	RolesSelect,
	user_roles
} from '../../../lib/drizzle/schemas/roles';
import { UsersSelect } from '../../../lib/drizzle/schemas/users';

export async function changeRole({
	user_id,
	role
}: {
	user_id: UsersSelect['id'];
	role: RolesSelect['role'];
}) {
	try {
		await db.insert(user_roles).values({ user_id, role });
	} catch (error) {
		throw error;
	}
}
