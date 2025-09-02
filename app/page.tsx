'use client';

import { Button } from '../components/ui/button';
import { logout } from './lib/actions/auth/logout';

export default function Home() {
	return (
		<div>
			<Button onClick={logout}>Log out</Button>
		</div>
	);
}
