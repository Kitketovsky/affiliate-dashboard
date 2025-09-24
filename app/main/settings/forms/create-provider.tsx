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
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../../../components/ui/input';
import { ServicesData } from '../page';
import { createProvider } from '../actions/create-provider';
import {
	zProvidersInsert,
	ProvidersInsert
} from '../../../lib/drizzle/schemas/providers';

import Image from 'next/image';
import { servicesLogos } from '../assets/logos';
import { ServicesInsert } from '../../../lib/drizzle/schemas/services';

export function CreateProvider({
	services
}: {
	services: ServicesData;
}) {
	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<
		ServicesInsert['category'] | undefined
	>(undefined);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(data: ProvidersInsert) {
		try {
			setError(null);
			setLoading(true);

			await createProvider(data);

			setOpen(false);
			// Reset form and category selection
			form.reset();
			setSelectedCategory(undefined);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	const form = useForm<ProvidersInsert>({
		resolver: zodResolver(zProvidersInsert),
		defaultValues: {
			service_id: '',
			label: '',
			api_key: ''
		}
	});

	const { handleSubmit, setValue } = form;

	// Watch for category changes and reset service selection
	const handleCategoryChange = (
		category: ServicesInsert['category']
	) => {
		setSelectedCategory(category);
		setValue('service_id', ''); // Reset service selection when category changes
	};

	const servicesForCategory = selectedCategory
		? services[selectedCategory]!
		: [];

	return (
		<Form {...form}>
			<Dialog
				onOpenChange={(open) => {
					setOpen(open);
					if (!open) {
						// Reset form and category selection when dialog closes
						form.reset();
						setSelectedCategory(undefined);
					}
				}}
				open={open}
			>
				<DialogTrigger asChild>
					<Button>Create provider</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<DialogHeader>
							<DialogTitle>Create provider</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>

						<FormField
							control={form.control}
							name='service_id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Select
											onValueChange={handleCategoryChange}
											value={selectedCategory}
										>
											<SelectTrigger className='w-[180px] capitalize'>
												<SelectValue placeholder='Select category' />
											</SelectTrigger>
											<SelectContent className='capitalize'>
												{Object.keys(services).map((category) => (
													<SelectItem value={category} key={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{selectedCategory && (
							<FormField
								control={form.control}
								name='service_id'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service Name</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<SelectTrigger className='w-[180px] capitalize'>
													<SelectValue placeholder='Select service' />
												</SelectTrigger>
												<SelectContent className='capitalize'>
													{servicesForCategory.map(({ id, name }) => {
														const logoImageData = servicesLogos[name];

														return (
															<SelectItem value={id} key={id}>
																<div className='flex items-center gap-2'>
																	{logoImageData && (
																		<Image
																			src={logoImageData}
																			alt={name}
																			className='w-5 h-5 rounded-sm'
																		/>
																	)}
																	<span className='capitalize'>
																		{name}
																	</span>
																</div>
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input placeholder='Label' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='api_key'
							render={({ field }) => (
								<FormItem>
									<FormLabel>API key</FormLabel>
									<FormControl>
										<Input
											placeholder='API key'
											type='password'
											{...field}
										/>
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
