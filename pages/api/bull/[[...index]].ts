// Workaround with Next.js Pages (App Router does not work)
// https://github.com/felixmosh/bull-board/issues/124#issuecomment-2143567492

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import { type NextApiRequest, type NextApiResponse } from 'next';
import IORedis from 'ioredis';
import { Queue, Worker } from 'bullmq';

const connection = new IORedis({
	host: '127.0.0.1',
	port: 6379,
	maxRetriesPerRequest: null
});

const CAMPAIGNS_QUEUE_NAME = 'campaigns_queue';

const campaigns_queue = new Queue(CAMPAIGNS_QUEUE_NAME);

export const campaigns_worker = new Worker(
	CAMPAIGNS_QUEUE_NAME,
	async (job) => {
		console.log('Received:', job.name, job.data);
	},
	{ connection }
);

const app = express();
const basePath = '/api/bull';
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath(basePath);

createBullBoard({
	queues: [
		new BullMQAdapter(campaigns_queue, {
			readOnlyMode: false,
			allowRetries: true
		})
	],
	serverAdapter: serverAdapter
});

const router = app.use(basePath, serverAdapter.getRouter());

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	return router(req, res);
}

export const config = {
	api: {
		externalResolver: true
	}
};
