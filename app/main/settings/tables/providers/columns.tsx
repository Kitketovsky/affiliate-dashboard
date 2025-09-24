'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProvidersData, ServicesData } from '../../page';
import { ProviderActions } from './actions';
import { servicesLogos } from '../../assets/logos';
import Image from 'next/image';

export function createColumns(services: ServicesData) {
	const columns: ColumnDef<ProvidersData[number]>[] = [
		{
			accessorKey: 'service',
			header: 'Service',
			cell: ({ row }) => {
				const service = row.original.service;
				if (!service) return null;

				const logoImageData = servicesLogos[service.name];

				return (
					<div className='flex items-center gap-2'>
						{logoImageData && (
							<Image
								src={logoImageData}
								alt={service.name}
								className='w-7 h-7 rounded-sm'
							/>
						)}
						<div>
							<div className='font-medium capitalize'>
								{service.name}
							</div>
							<div className='text-sm text-gray-500 capitalize'>
								{service.category}
							</div>
						</div>
					</div>
				);
			}
		},
		{
			accessorKey: 'label',
			header: 'Label',
			cell: ({ row }) => {
				return (
					<span className='capitalize'>{row.original.label}</span>
				);
			}
		},
		{
			accessorKey: 'api_key',
			header: 'API Key',
			cell: () => {
				return (
					<span className='text-sm text-gray-500'>
						{'*'.repeat(30)}
					</span>
				);
			}
		},
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => {
				return (
					<ProviderActions
						provider={row.original}
						services={services}
					/>
				);
			}
		}
	];

	return columns;
}
