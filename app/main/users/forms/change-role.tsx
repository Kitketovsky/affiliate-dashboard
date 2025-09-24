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
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import {
	RolesSelect,
	UserRolesSelect,
	zUserRolesInsert,
	zUserRolesUpdate
} from '../../../lib/drizzle/schemas/roles';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeRole } from '../actions/change-role';
import { UsersData } from '../page';

interface Props {
	userId: string;
	email: string;
	roles: RolesSelect[];
	userRole: UsersData[number]['role'];
}

export function ChangeRole({
	userId,
	email,
	roles,
	userRole
}: Props) {
	const [open, setOpen] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit({
		id
	}: {
		id: z.infer<typeof zUserRolesUpdate>['id'];
	}) {
		try {
			setError(null);
			setLoading(true);

			await changeRole({ user_id: userId, role_id: id });

			setOpen(false);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	const form = useForm<z.infer<typeof zUserRolesUpdate>>({
		resolver: zodResolver(zUserRolesUpdate),
		defaultValues: {
			id: roles.find(({ id }) => id !== userRole?.id)!.id!
		}
	});

	const { handleSubmit } = form;

	return (
		<Form {...form}>
			<Dialog onOpenChange={() => setOpen((p) => !p)} open={open}>
				<DialogTrigger asChild>
					<Button variant={'ghost'} className='w-full'>
						Change role
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<DialogHeader>
							<DialogTitle>Change role ({email})</DialogTitle>
							<DialogDescription>
								Change user's role to a different one
							</DialogDescription>
						</DialogHeader>
						<FormField
							control={form.control}
							name='id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className='w-[180px] capitalize'>
												<SelectValue placeholder='Role' />
											</SelectTrigger>
											<SelectContent>
												{roles.map(({ role, id }) => (
													<SelectItem
														value={id}
														className='capitalize'
														key={id}
														disabled={id === userRole?.id}
													>
														{role}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{error && (
							<div className='text-red-400 text-center text-sm'>
								<span>{error}</span>
							</div>
						)}

						<DialogFooter>
							<DialogClose asChild>
								<Button variant='outline' disabled={loading}>
									Cancel
								</Button>
							</DialogClose>
							<Button type='submit' disabled={loading}>
								Submit
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
