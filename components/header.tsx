'use client';

import Link from 'next/link';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import { logout } from '../app/lib/actions/auth/logout';
import { Button } from './ui/button';

const LINKS = [
	{ href: '/main', lable: 'Home' },
	{ href: '/main/users', lable: 'Users' }
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className='flex items-center justify-between py-6'>
			<nav className='flex items-center gap-4'>
				{LINKS.map(({ href, lable }) => (
					<Link
						className={cn({ 'font-semibold': pathname === href })}
						href={href}
					>
						{lable}
					</Link>
				))}
			</nav>

			<Button className='cursor-pointer' onClick={logout}>
				Log out
			</Button>
		</header>
	);
}
