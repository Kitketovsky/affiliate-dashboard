import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async rewrites() {
		// !FIXME: does not redirect
		return [
			{
				source: '/',
				destination: '/main'
			}
		];
	}
};

export default nextConfig;
