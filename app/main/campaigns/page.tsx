'use client';

import { Button } from '../../../components/ui/button';
import { createCampaign } from './actions/create-campaign';

export default function Campaigns() {
	return (
		<div>
			<Button
				onClick={async () =>
					await createCampaign({ message: 'yoooo!' })
				}
			>
				Submit campaigns
			</Button>
		</div>
	);
}
