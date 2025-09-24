'use client';

import { ProvidersData, ServicesData } from '../../page';
import { createColumns } from './columns';
import { DataTable } from '../../../../../components/ui/data-table';
import { CreateProvider } from '../../forms/create-provider';

interface Props {
	data: ProvidersData;
	services: ServicesData;
}

export function ProvidersTable({ data, services }: Props) {
	const columns = createColumns(services);

	return (
		<div className='flex flex-col gap-4'>
			<div>
				<CreateProvider services={services} />
			</div>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
