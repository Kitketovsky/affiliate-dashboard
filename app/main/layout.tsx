import { Button } from '../../components/ui/button';
import { logout } from '../lib/actions/auth/logout';

export default function MainLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<div className='flex items-center justify-between p-4'>
				<nav>
					<a href='/main/users'>Users</a>
				</nav>

				<Button onClick={logout}>Log out</Button>
			</div>
			<main>{children}</main>
		</div>
	);
}
