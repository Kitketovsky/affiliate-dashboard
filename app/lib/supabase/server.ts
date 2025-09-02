import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from './../../../envalid';
import { db } from '../drizzle';
import { sql, eq } from 'drizzle-orm';
import {
	appPermissionEnum,
	role_permissions
} from '../drizzle/schemas/permissions';
import { user_roles } from '../drizzle/schemas/roles';

export async function createClient() {
	const cookieStore = await cookies();
	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						);
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				}
			}
		}
	);
}

export async function getUserRoleAndPermissions() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error) throw error;

	const [{ role, permissions }] = await db
		.select({
			role: user_roles.role,
			permissions: sql<
				string[]
			>`array_agg(${role_permissions.permission})`
		})
		.from(user_roles)
		.leftJoin(
			role_permissions,
			eq(user_roles.role, role_permissions.role)
		)
		.where(eq(user_roles.user_id, data.user.id))
		.groupBy(user_roles.role);

	function hasPermission(
		permission: (typeof appPermissionEnum.enumValues)[number]
	) {
		return permission in permissions;
	}

	return {
		role,
		permissions: permissions as Array<
			(typeof appPermissionEnum.enumValues)[number]
		>,
		hasPermission
	};
}
