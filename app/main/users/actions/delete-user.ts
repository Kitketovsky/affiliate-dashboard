'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../../lib/supabase/server';
import { UsersSelect } from '../../../lib/drizzle/schemas/users';

export async function deleteUser(id: UsersSelect['id']) {
	const supabase = await createClient(true);

	const { error } = await supabase.auth.admin.deleteUser(id);

	if (error) {
		throw new Error(error.message);
	}

	revalidatePath('/users');
}
