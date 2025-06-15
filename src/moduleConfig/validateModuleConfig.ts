import * as v from 'valibot'

import { NPM_REGISTRY } from '../constants.ts'
import { logger } from '../util/logger.ts'

/**
 * Configuration interface for micro-frontend applications.
 * Used to define the relationship between host and remote modules in a micro-frontend architecture.
 */
export interface ModuleConfig {
	/** The unique identifier for the remote module.
	 * @example 'template' */
	moduleName: string

	/**
	 * The name of the host package that will consume this module. Should match the package.json name field of the host.
	 * You can use it with specified version `'@atomazing-org/host@0.0.1'` - preferred.
	 * Or you can omit the exact version, and then it will use the `latest` tag - `'@atomazing-org/host'`
	 * @example '@atomazing-org/host@0.0.1'
	 */
	hostPackage: string

	/**
	 * Optional custom NPM registry URL for fetching the host module.
	 * @default 'https://registry.npmjs.org/'
	 * @example 'https://registry.npmjs.org/'
	 */
	npmRegistryUrl?: string
}

const moduleConfigSchema = v.object({
	moduleName: v.string(),
	hostPackage: v.string(),
	npmRegistryUrl: v.optional(v.pipe(v.string(), v.url()), NPM_REGISTRY),
}) satisfies v.GenericSchema<ModuleConfig>

export const validateModuleConfig = (config: unknown) => {
	try {
		const moduleConfig = v.parse(moduleConfigSchema, config)
		return moduleConfig
	} catch (error) {
		logger.error(error)
		process.exit(1)
	}
}
