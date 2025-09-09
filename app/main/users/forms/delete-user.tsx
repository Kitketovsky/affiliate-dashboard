'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { useState } from 'react';
import { UsersSelect } from '../../../lib/drizzle/schemas/users';
import { deleteUser } from '../actions/delete-user';

export function DeleteUser({ id, email }: UsersSelect) {
	const [open, setOpen] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit() {
		try {
			setError(null);
			setLoading(true);
			await deleteUser(id);
			setOpen(false);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog onOpenChange={() => setOpen((p) => !p)} open={open}>
			<DialogTrigger asChild>
				<Button variant={'ghost'} className='w-full'>
					Delete user
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Delete user</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the user '{email}'?
					</DialogDescription>
				</DialogHeader>

				{error && (
					<div className='text-red-400 text-center'>
						<span>{error}</span>
					</div>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline' disabled={loading}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type='submit'
						variant='destructive'
						onClick={onSubmit}
						disabled={loading}
					>
						Remove
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
