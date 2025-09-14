'use server';

import { db } from '../../../lib/drizzle';
import {
	Role,
	user_roles,
	UserRolesSelect
} from '../../../lib/drizzle/schemas/roles';
import { createClient } from '../../../lib/supabase/server';

export async function inviteUser({
	email,
	role_id
}: {
	email: string;
	role_id: UserRolesSelect['role_id'];
}) {
	const supabase = await createClient(true);

	const { data, error } = await supabase.auth.admin.inviteUserByEmail(
		email,
		{
			redirectTo: 'http://localhost:3000/signup'
		}
	);

	if (error) throw new Error(error.message);

	await db
		.insert(user_roles)
		.values({ role_id, user_id: data.user.id });
}
