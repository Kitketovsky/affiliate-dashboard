import IORedis from 'ioredis';

export const connection = new IORedis({
	host: '127.0.0.1',
	port: 6379,
	maxRetriesPerRequest: null
});

export const DEFAULT_QUEUE_OPTIONS = {
	connection,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: 'exponential',
			delay: 5000
		}
	}
};
