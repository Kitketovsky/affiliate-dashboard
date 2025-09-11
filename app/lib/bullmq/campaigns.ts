import { Queue, Worker } from 'bullmq';
import { connection, DEFAULT_QUEUE_OPTIONS } from '.';

export const CAMPAIGNS_QUEUE_NAME = 'campaigns';

export const campaigns_queue = new Queue(
	CAMPAIGNS_QUEUE_NAME,
	DEFAULT_QUEUE_OPTIONS
);

export const campaigns_worker = new Worker(
	CAMPAIGNS_QUEUE_NAME,
	async (job) => {
		// triggered when all children flow jobs are 'completed'
		// job.getChildrenValues() - > outputs from direct children.
		// it will outpus the values of the last step
	},
	{ connection }
);
