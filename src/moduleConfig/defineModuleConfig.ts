import { merge } from 'ts-deepmerge'
import { defineConfig, type UserConfig as ViteConfig } from 'vite'
import externalize from 'vite-plugin-externalize-dependencies'

import { installer } from '../installer/index.ts'
import { createEntrypointPlugin } from '../plugins/index.ts'
import { DEV_DIR, EXTERNAL_DEPS, MODULE_ENTRYPOINT, OUTPUT_MODULE_PREFIX } from '../constants.ts'

import { validateModuleConfig, type ModuleConfig } from './validateModuleConfig.ts'

const getDevConfig = (_config: ModuleConfig) =>
	({
		root: DEV_DIR,
		plugins: [externalize({ externals: EXTERNAL_DEPS })],
		esbuild: { jsxDev: false },
	}) satisfies ViteConfig

const getProdConfig = (config: ModuleConfig) =>
	({
		plugins: [createEntrypointPlugin()],
		build: {
			target: 'esnext',
			minify: false,
			lib: {
				entry: MODULE_ENTRYPOINT,
				formats: ['es'],
			},
			rollupOptions: {
				external: EXTERNAL_DEPS,
				output: {
					entryFileNames: `${OUTPUT_MODULE_PREFIX}-${config.moduleName}-[hash].js`,
				},
			},
		},
	}) satisfies ViteConfig

const isDev = process.env.NODE_ENV === 'development'

export const defineModuleConfig = async (
	moduleConfig: ModuleConfig,
	clientViteConfig: ViteConfig,
): Promise<ViteConfig> => {
	const verifiedModuleConfig = validateModuleConfig(moduleConfig)

	if (isDev) installer(verifiedModuleConfig.hostPackage, verifiedModuleConfig.npmRegistryUrl)

	const stageConfig = isDev
		? getDevConfig(verifiedModuleConfig)
		: getProdConfig(verifiedModuleConfig)

	const resultConfig = merge(clientViteConfig, stageConfig)
	return defineConfig(resultConfig)
}
