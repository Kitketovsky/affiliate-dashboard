'use client';

import { RolesSelect } from '../../../lib/drizzle/schemas/roles';
import { UsersData } from '../../../lib/drizzle/schemas/users';
import { createColumns } from './columns';
import { DataTable } from './data-table';
import { CreateUser } from '../forms/invite-user';

interface Props {
	data: UsersData[];
	roles: RolesSelect[];
}

export function UsersTable({ roles, data }: Props) {
	const columns = createColumns({ roles });

	return (
		<div className='space-y-4'>
			{/* Actions */}
			<div>
				<CreateUser roles={roles} />
			</div>

			<DataTable columns={columns} data={data} />
		</div>
	);
}
