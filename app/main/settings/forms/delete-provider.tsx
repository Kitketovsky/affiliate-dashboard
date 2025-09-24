'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { ProvidersData } from '../page';
import { useState } from 'react';
import { deleteProvider } from '../actions/delete-provider';

interface DeleteProviderProps {
	provider: ProvidersData[number];
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteProvider({
	provider,
	open,
	onOpenChange
}: DeleteProviderProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit() {
		try {
			setError(null);
			setLoading(true);
			await deleteProvider(provider.id);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Delete user</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the provider?
					</DialogDescription>
				</DialogHeader>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DialogClose>
					<Button
						type='submit'
						variant='destructive'
						onClick={onSubmit}
						disabled={loading}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
