'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/app/lib/actions/auth/login';
import { useState } from 'react';

export const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6).max(50)
});

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: ''
		}
	});

	const { handleSubmit } = form;

	async function onSubmit(data: z.infer<typeof LoginSchema>) {
		try {
			setError(null);
			setLoading(true);
			await login(data);
		} catch (error) {
			const tError = error as { message: string };
			setError(tError.message);
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-8 max-w-xs w-full'
			>
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

				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type='submit' className='mx-auto' disabled={loading}>
					Submit
				</Button>

				{error && (
					<div className='text-center text-red-400'>
						<span>{error}</span>
					</div>
				)}
			</form>
		</Form>
	);
}
