import { AuthProvider } from '../../components/AuthProvider';
import { Header } from '../../components/header';

export default function MainLayout({
	children
}: LayoutProps<'/main'>) {
	return (
		<AuthProvider>
			<Header />
			<main>{children}</main>
		</AuthProvider>
	);
}
