'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/app/lib/supabase/server';
import { LoginSchema } from '@/app/login/page';
import z from 'zod';

export async function login({
	email,
	password
}: z.infer<typeof LoginSchema>) {
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (error) {
		throw new Error(error.message);
	}

	redirect('/main');
}
