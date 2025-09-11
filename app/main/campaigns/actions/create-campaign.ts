'use server';

import { CAMPAIGNS_STEPS_QUEUE_NAME } from '../../../lib/bullmq/campaign_steps';
import { CAMPAIGNS_QUEUE_NAME } from '../../../lib/bullmq/campaigns';
import {
	campaignsFlowProducer,
	campaignsFlowSteps
} from '../../../lib/bullmq/campaigns_steps_flow';
import { createSequentialFlow } from '../../../lib/bullmq/utils';

export async function createCampaign(data: { message: string }) {
	await campaignsFlowProducer.add(
		{
			name: 'campaigns-creation',
			queueName: CAMPAIGNS_QUEUE_NAME,
			children: createSequentialFlow(
				campaignsFlowSteps.slice(0, 3),
				data
			)
		},
		{
			queuesOptions: {
				[CAMPAIGNS_STEPS_QUEUE_NAME]: {
					defaultJobOptions: {
						delay: 1000
					}
				}
			}
		}
	);
}
