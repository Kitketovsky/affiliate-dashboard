'use client';

import React, { useEffect } from 'react';
import { createClient } from '../app/lib/supabase/client';
import { redirect } from 'next/navigation';

export function AuthProvider({ children }: React.PropsWithChildren) {
	useEffect(() => {
		const supabase = createClient();

		supabase.auth.onAuthStateChange((_, session) => {
			if (!session) {
				redirect('/login');
			}
		});
	}, []);

	return children;
}
