import { createViteConfig } from '@atomazing-org/vite-config'

const isDevHost = process.env.npm_lifecycle_event === 'dev:host'

const DEV_ENABLE_HTTPS = isDevHost // Enable HTTPS with npm run dev:host
const DEV_ENABLE_PWA = false

export default createViteConfig({
	server: {
		port: 3001,
	},
	moduleFederationOptions: {
		name: 'remote',
		filename: 'remoteEntry.js',
		exposes: {
			'./mount': './src/mount.tsx',
		}
	},
	enableDevPwa: DEV_ENABLE_PWA,
	enableHttps: DEV_ENABLE_HTTPS,
	enableI8n: false,
	preview: {
		port: 3001,
	},
})
