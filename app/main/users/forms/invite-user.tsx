import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../../../../components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../../../../components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Input } from '../../../../components/ui/input';
import {
	RolesSelect,
	zUserRolesInsert
} from '../../../lib/drizzle/schemas/roles';
import { inviteUser } from '../actions/invite-user';

export const CreateUserSchema = z.object({
	email: z.email(),
	role_id: zUserRolesInsert.shape.role_id
});

export function InviteUser({ roles }: { roles: RolesSelect[] }) {
	const [open, setOpen] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit({
		email,
		role_id
	}: z.infer<typeof CreateUserSchema>) {
		try {
			setError(null);
			setLoading(true);

			await inviteUser({ email, role_id });

			setOpen(false);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	const form = useForm<z.infer<typeof CreateUserSchema>>({
		resolver: zodResolver(CreateUserSchema),
		defaultValues: {
			email: '',
			role_id: roles[0].id
		}
	});

	const { handleSubmit } = form;

	return (
		<Form {...form}>
			<Dialog onOpenChange={() => setOpen((p) => !p)} open={open}>
				<DialogTrigger asChild>
					<Button>Invite user</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<DialogHeader>
							<DialogTitle>Invite user</DialogTitle>
							<DialogDescription>
								Invite user via email
							</DialogDescription>
						</DialogHeader>

						<FormField
							control={form.control}
							name='role_id'
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

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Email' {...field} />
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
