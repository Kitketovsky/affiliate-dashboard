'use server';

import { db } from '../../../lib/drizzle';
import { Role, user_roles } from '../../../lib/drizzle/schemas/roles';
import { createClient } from '../../../lib/supabase/server';

export async function inviteUser({
	email,
	role
}: {
	email: string;
	role: Role;
}) {
	const supabase = await createClient(true);

	const { data, error } = await supabase.auth.admin.inviteUserByEmail(
		email,
		{
			redirectTo: 'http://localhost:3000/signup'
		}
	);

	if (error) throw new Error(error.message);

	await db.insert(user_roles).values({ role, user_id: data.user.id });
}
