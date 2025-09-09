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
import {
	UsersData,
	UsersSelect
} from '../../../lib/drizzle/schemas/users';
import { useState } from 'react';
import {
	appRolesEnum,
	RolesSelect,
	UserRolesSelect
} from '../../../lib/drizzle/schemas/roles';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSelectSchema } from 'drizzle-zod';
import { changeRole } from '../actions/change-role';

interface Props extends UsersSelect {
	roles: RolesSelect[];
	userRole: UsersData['role'];
}

export const ChangeRoleSchema = z.object({
	role: createSelectSchema(appRolesEnum)
});

export function ChangeRole({ id, email, roles, userRole }: Props) {
	const [open, setOpen] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit({
		role
	}: {
		role: UserRolesSelect['role'];
	}) {
		try {
			setError(null);
			setLoading(true);

			await changeRole({ user_id: id, role });

			setOpen(false);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	const form = useForm<z.infer<typeof ChangeRoleSchema>>({
		resolver: zodResolver(ChangeRoleSchema),
		defaultValues: {
			role: roles.find(({ role }) => role !== userRole)!.role
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
							name='role'
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
														value={role}
														className='capitalize'
														key={id}
														disabled={role === userRole}
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
