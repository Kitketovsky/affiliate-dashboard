'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { DeleteUser } from '../forms/delete-user';
import { ChangeRole } from '../forms/change-role';
import { RolesSelect } from '../../../lib/drizzle/schemas/roles';
import { type UsersData } from '../page';

export function createColumns({ roles }: { roles: RolesSelect[] }) {
	const columns: ColumnDef<UsersData[number]>[] = [
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) => {
				return (
					<span className='capitalize'>
						{row.original.role?.role}
					</span>
				);
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-[200px]'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<DeleteUser id={user.id} email={user.email} />
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<ChangeRole
									userId={user.id}
									email={user.email}
									userRole={row.original.role}
									roles={roles}
								/>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			}
		}
	];

	return columns;
}
