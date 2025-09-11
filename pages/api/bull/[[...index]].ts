// Workaround with Next.js Pages (App Router does not work)
// https://github.com/felixmosh/bull-board/issues/124#issuecomment-2143567492

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { campaigns_queue } from '../../../app/lib/bullmq/campaigns';
import { campaigns_steps_queue } from '../../../app/lib/bullmq/campaign_steps';

const app = express();
const basePath = '/api/bull';
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath(basePath);

createBullBoard({
	queues: [
		new BullMQAdapter(campaigns_queue, {
			readOnlyMode: false,
			allowRetries: true
		}),
		new BullMQAdapter(campaigns_steps_queue, {
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
