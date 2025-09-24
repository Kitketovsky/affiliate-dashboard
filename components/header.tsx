import Link from 'next/link';
import { logout } from '../app/lib/actions/auth/logout';
import { Button } from './ui/button';
import { HTMLAttributeAnchorTarget } from 'react';
import { PermissionsSelect } from '../app/lib/drizzle/schemas/permissions';

type Links = Array<{
	href: string;
	label: string;
	target?: HTMLAttributeAnchorTarget;
	resource?: PermissionsSelect['resource'];
	action?: PermissionsSelect['action'];
}>;

const LINKS: Links = [
	{ href: '/main', label: 'Home' },
	{
		href: '/main/users',
		label: 'Users',
		resource: 'users',
		action: 'read'
	},
	{
		href: '/main/campaigns',
		label: 'Campaigns',
		resource: 'campaigns',
		action: 'read'
	},
	{
		href: '/api/bull',
		label: 'Queues',
		target: '_blank',
		resource: 'queues',
		action: 'read'
	},
	{
		href: '/main/settings',
		label: 'Settings',
		resource: 'settings',
		action: 'read'
	}
];

export function Header() {
	return (
		<header className='flex items-center justify-between py-6'>
			<nav className='flex items-center gap-4'>
				{LINKS.map(({ href, label, resource, action, ...rest }) => (
					<Link href={href} key={label} {...rest}>
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
