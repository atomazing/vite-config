/// <reference types="vitest" />
import { defineConfig, PluginOption } from 'vite'
import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { qrcode } from 'vite-plugin-qrcode'
import defaultWorkboxConfig from '../configs/workbox.config'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import { findTsModule } from './helpers'
import { ModuleFederationOptions } from '@module-federation/vite/lib/utils/normalizeModuleFederationOptions'


type Args = {
	enableDevPwa?: boolean
	enableHttps?: boolean
	moduleFederationOptions?: Partial<ModuleFederationOptions> & Pick<ModuleFederationOptions, 'name'>
}

// https://vitejs.dev/config/
export async function createViteConfig({
	enableDevPwa = false,
	enableHttps = false,
	moduleFederationOptions,
}: Args) {
	const manifest = await findTsModule('manifest.ts')
	const workboxConfig = await findTsModule('workbox.config.ts')

	const plugins: PluginOption[] = []

	if (manifest) {
		console.log('🔧 Detected manifest.ts')
		if (workboxConfig) {
			console.log('🔧 Detected workbox.config.ts')
		} else {
			console.log('🔧 Default workbox.config.ts should be used')
		}
		// https://vite-pwa-org.netlify.app/
		plugins.push(
			VitePWA({
				devOptions: {
					enabled: enableDevPwa,
					type: 'module',
				},

				manifest,
				registerType: 'prompt',
				workbox: workboxConfig ? workboxConfig : defaultWorkboxConfig,
				includeAssets: ['**/*', 'sw.js'],
			}),
		)
		console.log('🛠️ vite-plugin-pwa is connected')
	}

	if (moduleFederationOptions) {
		plugins.push(
			federation({
				filename: 'remoteEntry.js',
				shared: ['react', 'react-dom'],
				...moduleFederationOptions,
			}),
		)
		console.log('🛠️ @module-federation/vite is connected')
	}

	if (enableHttps) {
		plugins.push(basicSsl())
		console.log('🛠️ @vitejs/plugin-basic-ssl is connected ')
	}

	return defineConfig({
		server: {
			port: 3000,
		},
		test: {
			globals: true,
		},
		plugins: [
			...plugins,
			react({
				jsxImportSource: '@emotion/react',
				babel: {
					plugins: ['@emotion/babel-plugin', '@lingui/babel-plugin-lingui-macro'],
				},
			}),
			tsconfigPaths(),
			// Generate QR code for npm run dev:host
			qrcode({
				filter: url => url.startsWith('http://192.168.0.') || url.startsWith('https://192.168.0.'),
			}),
			checker({
				typescript: true,
			}),
		],
		resolve: {
			extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.mjs', '.mts'],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.code === 'SOURCEMAP_ERROR' ||
						warning.message.includes('PURE') // ignore PURE comment warning
					) {
						return
					}
					warn(warning)
				},
				output: {
					manualChunks(id) {
						if (id.includes('node_modules')) {
							if (id.includes('@mui') || id.includes('@emotion')) {
								return 'ui-lib'
							}
							return 'vendor' // other node_modules
						}
					},
				},
			},
		},
	})
}
