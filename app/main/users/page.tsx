import { getUserRoleAndPermissions } from '../../lib/supabase/server';

export default async function Users() {
	const { role, hasPermission } = await getUserRoleAndPermissions();

	return <div>Users</div>;
}
