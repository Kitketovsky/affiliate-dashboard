'use server';

import { db } from '../../../lib/drizzle';
import {
	user_roles,
	UserRolesSelect
} from '../../../lib/drizzle/schemas/roles';

export async function changeRole({
	user_id,
	role_id
}: {
	user_id: UserRolesSelect['user_id'];
	role_id: UserRolesSelect['role_id'];
}) {
	try {
		await db.insert(user_roles).values({ user_id, role_id });
	} catch (error) {
		throw error;
	}
}
