import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from './../../../envalid';
import { db } from '../drizzle';
import { sql, eq } from 'drizzle-orm';
import {
	permissions as permissions_table,
	PermissionsSelect,
	role_permissions
} from '../drizzle/schemas/permissions';
import { user_roles, roles } from '../drizzle/schemas/roles';
import { users } from '../drizzle/schemas/users';

export async function createClient(isAdmin = false) {
	const cookieStore = await cookies();
	return createServerClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		isAdmin
			? env.SUPABASE_SERVICE_ROLE_KEY
			: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

export async function hasAuthority(
	resource: PermissionsSelect['resource'],
	action: PermissionsSelect['action']
) {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error) {
		return false;
	}

	const [{ permissions }] = await db
		.select({
			permissions: sql<
				Array<{
					action: PermissionsSelect['action'];
					resource: PermissionsSelect['resource'];
				}>
			>`
      coalesce(
        array_agg(
          jsonb_build_object(
            'action', ${permissions_table}.action,
            'resource', ${permissions_table}.resource
          )
        ) filter (where ${permissions_table}.id is not null),
        array[]::jsonb[]
      )
    `
		})
		.from(users)
		.leftJoin(user_roles, eq(users.id, user_roles.user_id))
		.leftJoin(roles, eq(user_roles.role_id, roles.id))
		.leftJoin(
			role_permissions,
			eq(roles.id, role_permissions.role_id)
		)
		.leftJoin(
			permissions_table,
			eq(role_permissions.permission_id, permissions_table.id)
		)
		.where(eq(users.id, data.user.id));

	const isAuthorized = permissions.find(
		(permission) =>
			permission.resource === resource && permission.action === action
	);

	return Boolean(isAuthorized);
}
