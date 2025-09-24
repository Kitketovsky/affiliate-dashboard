'use client';

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
	DialogTitle
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
import { Input } from '../../../../components/ui/input';
import { ServicesData, ProvidersData } from '../page';
import { updateProvider } from '../actions/update-provider';
import { decryptSecret } from '../actions/decrypt-secret';
import { Eye, EyeOff } from 'lucide-react';
import { servicesLogos } from '../assets/logos';
import Image from 'next/image';
import {
	ProvidersInsert,
	zProvidersInsert,
	zProvidersUpdate
} from '../../../lib/drizzle/schemas/providers';
import { ServicesInsert } from '../../../lib/drizzle/schemas/services';

interface EditProviderProps {
	provider: ProvidersData[number];
	services: ServicesData;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function EditProvider({
	provider,
	services,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange
}: EditProviderProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen ?? internalOpen;
	const onOpenChange = controlledOnOpenChange ?? setInternalOpen;
	const [selectedCategory, setSelectedCategory] = useState<
		ServicesInsert['category'] | undefined
	>(provider.service?.category || undefined);
	const [showApiKey, setShowApiKey] = useState(false);
	const [decryptedApiKey, setDecryptedApiKey] = useState<string>('');
	const [isDecrypting, setIsDecrypting] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Function to decrypt API key
	const handleDecryptApiKey = async () => {
		if (!provider.api_key?.id) return;

		try {
			setIsDecrypting(true);
			setError(null);

			const result = await decryptSecret(provider.api_key.id);

			if (result.success && result.decryptedSecret) {
				setDecryptedApiKey(result.decryptedSecret);
				setShowApiKey(true);
				// Set the form field value to the decrypted API key for editing
				setValue('api_key', result.decryptedSecret);
			} else {
				setError(result.error || 'Failed to decrypt API key');
			}
		} catch (error) {
			setError('Failed to decrypt API key');
		} finally {
			setIsDecrypting(false);
		}
	};

	// Function to toggle API key visibility
	const handleToggleApiKeyVisibility = () => {
		if (showApiKey) {
			// Hide the API key
			setShowApiKey(false);
			setDecryptedApiKey('');
			setValue('api_key', '');
		} else {
			// Show the API key (decrypt if needed)
			if (decryptedApiKey) {
				setShowApiKey(true);
				setValue('api_key', decryptedApiKey);
			} else {
				handleDecryptApiKey();
			}
		}
	};

	async function onSubmit(data: ProvidersInsert) {
		try {
			setError(null);
			setLoading(true);

			await updateProvider({
				id: provider.id,
				label: data.label,
				service_id: data.service_id,
				api_key: data.api_key || undefined
			});

			onOpenChange(false);
		} catch (error) {
			setError((error as { message: string }).message);
		} finally {
			setLoading(false);
		}
	}

	const form = useForm<ProvidersInsert>({
		resolver: zodResolver(zProvidersInsert),
		defaultValues: {
			service_id: provider.service?.id || '',
			label: provider.label || '',
			api_key: ''
		}
	});

	const { handleSubmit, setValue } = form;

	const handleCategoryChange = (
		category: ServicesInsert['category']
	) => {
		setSelectedCategory(category);
		setValue('service_id', '');
	};

	const servicesForCategory = selectedCategory
		? services[selectedCategory]!
		: [];

	return (
		<Form {...form}>
			<Dialog
				onOpenChange={(isOpen) => {
					onOpenChange(isOpen);
					if (!isOpen) {
						// Reset form and category selection when dialog closes
						form.reset();
						setSelectedCategory(
							provider.service?.category || undefined
						);
						setShowApiKey(false);
						setDecryptedApiKey('');
						setIsDecrypting(false);
					}
				}}
				open={open}
			>
				<DialogContent className='sm:max-w-[425px]'>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='space-y-6'
					>
						<DialogHeader>
							<DialogTitle>Edit provider</DialogTitle>
							<DialogDescription>
								Update the provider information. Click the eye icon to
								view/edit the API key.
							</DialogDescription>
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
										<div className='relative'>
											<Input
												placeholder={
													showApiKey
														? 'Enter API key'
														: 'Click eye icon to view/edit API key'
												}
												type={showApiKey ? 'text' : 'password'}
												{...field}
												value={
													showApiKey && decryptedApiKey
														? field.value || decryptedApiKey
														: showApiKey
															? field.value
															: '••••••••••••••••'
												}
												onChange={(e) => {
													field.onChange(e);
													// Update decryptedApiKey when user types
													if (showApiKey) {
														setDecryptedApiKey(e.target.value);
													}
												}}
												disabled={!showApiKey}
											/>
											<Button
												type='button'
												variant='ghost'
												size='sm'
												className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
												onClick={handleToggleApiKeyVisibility}
												disabled={isDecrypting}
											>
												{isDecrypting ? (
													<div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
												) : showApiKey ? (
													<EyeOff className='h-4 w-4' />
												) : (
													<Eye className='h-4 w-4' />
												)}
											</Button>
										</div>
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
								{loading ? 'Updating...' : 'Update Provider'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</Form>
	);
}
