'use client';

import { RolesSelect } from '../../../lib/drizzle/schemas/roles';
import { createColumns } from './columns';
import { DataTable } from './data-table';
import { InviteUser } from '../forms/invite-user';
import { type UsersData } from '../page';

interface Props {
	data: UsersData;
	roles: RolesSelect[];
}

export function UsersTable({ roles, data }: Props) {
	const columns = createColumns({ roles });

	return (
		<div className='space-y-4'>
			{/* Actions */}
			<div>
				<InviteUser roles={roles} />
			</div>

			<DataTable columns={columns} data={data} />
		</div>
	);
}
