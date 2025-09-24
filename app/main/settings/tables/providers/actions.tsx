import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator
} from './../../../../../components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditProvider } from '../../forms/edit-provider';
import { ProvidersData, ServicesData } from '../../page';
import { DeleteProvider } from '../../forms/delete-provider';

// Actions component for each row
export function ProviderActions({
	provider,
	services
}: {
	provider: ProvidersData[number];
	services: ServicesData;
}) {
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showDeleteProviderDialog, setShowDeleteProviderDialog] =
		useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={() => setShowEditDialog(true)}>
						<Edit className='mr-2 h-4 w-4' />
						Edit
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setShowDeleteProviderDialog(true)}
						className='text-red-600 focus:text-red-600'
					>
						<Trash2 className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditProvider
				provider={provider}
				services={services}
				open={showEditDialog}
				onOpenChange={setShowEditDialog}
			/>

			<DeleteProvider
				provider={provider}
				open={showDeleteProviderDialog}
				onOpenChange={setShowDeleteProviderDialog}
			/>
		</>
	);
}
