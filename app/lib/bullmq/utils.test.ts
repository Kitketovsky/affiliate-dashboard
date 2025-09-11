import { CAMPAIGNS_STEPS_QUEUE_NAME } from './campaign_steps';
import { createSequentialFlow } from './utils';
import { it, expect } from 'vitest';

it('returns proper job tree', () => {
	const input = [
		{
			name: 'domain_purchase',
			data: {},
			queueName: CAMPAIGNS_STEPS_QUEUE_NAME
		},
		{
			name: 'vps_purchase',
			data: {},
			queueName: CAMPAIGNS_STEPS_QUEUE_NAME
		},
		{
			name: 'domain_add_dns_records',
			data: {},
			queueName: CAMPAIGNS_STEPS_QUEUE_NAME
		}
	];

	const result = createSequentialFlow(input);

	const expected_output = [
		{
			name: 'domain_add_dns_records',
			data: {},
			queueName: CAMPAIGNS_STEPS_QUEUE_NAME,
			children: [
				{
					name: 'vps_purchase',
					data: {},
					queueName: CAMPAIGNS_STEPS_QUEUE_NAME,
					children: [
						{
							name: 'domain_purchase',
							data: {},
							queueName: CAMPAIGNS_STEPS_QUEUE_NAME
						}
					]
				}
			]
		}
	];

	expect(result).toStrictEqual(expected_output);
});
