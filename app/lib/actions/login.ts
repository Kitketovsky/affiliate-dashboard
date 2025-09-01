'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { LoginSchema } from '../../login/page';

export async function login({
	email,
	password
}: {
	email: string;
	password: string;
}) {
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		throw new Error(error.message);
	}

	redirect('/');
}
