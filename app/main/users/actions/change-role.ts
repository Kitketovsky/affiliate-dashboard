'use server';

import { db } from '../../../lib/drizzle';
import {
	user_roles,
	UserRolesInsert
} from '../../../lib/drizzle/schemas/roles';

export async function changeRole({
	user_id,
	role_id
}: {
	user_id: UserRolesInsert['user_id'];
	role_id: UserRolesInsert['role_id'];
}) {
	try {
		await db.insert(user_roles).values({ user_id, role_id });
	} catch (error) {
		throw error;
	}
}
