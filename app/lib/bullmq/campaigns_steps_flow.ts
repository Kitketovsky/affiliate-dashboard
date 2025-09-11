import { FlowProducer } from 'bullmq';
import { CAMPAIGNS_STEPS_QUEUE_NAME } from './campaign_steps';
import { CAMPAIGNS_QUEUE_NAME } from './campaigns';

export const campaignsFlowProducer = new FlowProducer();

const ONE_MINUTE = 60000;

export const campaignsFlowSteps = [
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
		// opts: {
		// 	delay: ONE_MINUTE * 2
		// }
	},
	{
		name: 'ssh_update_packages',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
		// opts: {
		// 	delay: ONE_MINUTE * 20
		// }
	},
	{
		name: 'ssh_update_server_name',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'ssh_install_certbot',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
		// opts: {
		// 	attempts: 3,
		// 	backoff: {
		// 		type: 'exponential',
		// 		delay: ONE_MINUTE * 5
		// 	}
		// }
	},
	{
		name: 'files_install_offer',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'files_check_index_kclient_files',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'tracker_create_campaign',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'tracker_cloak_integration',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'tracker_offer_integration',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'white_installing',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'ssh_change_folder_rights',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'ssh_change_files_rights',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	},
	{
		name: 'ssh_restart_server',
		data: {},
		queueName: CAMPAIGNS_STEPS_QUEUE_NAME
	}
];
