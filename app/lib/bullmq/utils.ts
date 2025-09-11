import { FlowChildJob } from 'bullmq';

// BullMQ Flows
// https://docs.bullmq.io/guide/flows#tab-typescript-2

// To make a job flow sequential we need to make a nested tree of jobs
// where the tree leef will be the first to execute and the root will be the last
export function createSequentialFlow(
	steps: FlowChildJob[],
	data?: any
): FlowChildJob[] {
	let children: FlowChildJob[] = [];

	for (const step of steps) {
		if (children.length) {
			step.children = children;
		}

		if (data) {
			step.data = data;
		}

		children = [step];
	}

	return children;
}
