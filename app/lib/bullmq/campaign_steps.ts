import { Job, Queue, Worker } from 'bullmq';
import { connection, DEFAULT_QUEUE_OPTIONS } from '.';

export const CAMPAIGNS_STEPS_QUEUE_NAME = 'campaigns_steps';

export const campaigns_steps_queue = new Queue(
	CAMPAIGNS_STEPS_QUEUE_NAME,
	DEFAULT_QUEUE_OPTIONS
);

export const campaigns_steps_worker = new Worker(
	CAMPAIGNS_STEPS_QUEUE_NAME,
	async (job) => {
		// TODO: processStep function

		const thisStepGeneratedData = { [job.name]: Math.random() };

		if (job.parent?.id) {
			const nextStepJob = await Job.fromId(
				campaigns_steps_queue,
				job.parent.id
			);

			if (nextStepJob) {
				await nextStepJob.updateData({
					...job.data,
					...thisStepGeneratedData
				});
			}
		}

		return thisStepGeneratedData;
	},
	{ connection }
);

campaigns_steps_worker.on('completed', (job) => {
	console.log(`Job ${job.name} completed with`, job.returnvalue);
	// TODO: update step in database
});
