'use client';

import Link from 'next/link';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import { logout } from '../app/lib/actions/auth/logout';
import { Button } from './ui/button';

const LINKS = [
	{ href: '/main', label: 'Home' },
	{ href: '/main/users', label: 'Users' },
	{ href: '/api/bull', label: 'BullMQ', target: '_blank' }
];

export function Header() {
	const pathname = usePathname();

	return (
		<header className='flex items-center justify-between py-6'>
			<nav className='flex items-center gap-4'>
				{LINKS.map(({ href, label, ...rest }) => (
					<Link
						className={cn({ 'font-semibold': pathname === href })}
						href={href}
						key={label}
						{...rest}
					>
						{label}
					</Link>
				))}
			</nav>

			<Button className='cursor-pointer' onClick={logout}>
				Log out
			</Button>
		</header>
	);
}
