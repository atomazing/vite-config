import { existsSync, mkdirSync } from 'node:fs'

import { DEV_DIR } from '../constants.ts'
import { logger } from '../util/logger.ts'

import { downloadPackage } from './downloadPackage.ts'
import { getAuth } from './getAuth.ts'
import { getPackageInfo } from './getPackageInfo.ts'
import { readShasumFromModuleInfo, writeShasumToModuleInfo } from './moduleInfo.ts'
import { createSymlink } from './createSymlink.ts'

/**
 * Installs or updates a package in the development directory.
 *
 * This function checks if the package needs to be installed or updated based on its shasum.
 * If necessary, it downloads the package, updates the module info, and creates a symlink.
 *
 * @param packageName - The name of the package to install or update.
 * @param npmRegistryUrl - The URL to the NPM Registry where to look for the package.
 */
export const installer = async (packageName: string, npmRegistryUrl: string) => {
	try {
		logger.info(`Initializing ${DEV_DIR}`)
		if (!existsSync(DEV_DIR)) mkdirSync(DEV_DIR)
		const existingShasum = readShasumFromModuleInfo(DEV_DIR)
		const { tarball, shasum } = await getPackageInfo(packageName)

		if (!existingShasum || existingShasum !== shasum) {
			logger.info(`Hash in ${DEV_DIR} is missing or does not match the package hash`)
			logger.info(`Starting installation of package ${packageName} in ${DEV_DIR}`)

			const auth = getAuth(npmRegistryUrl)
			await downloadPackage({ packageTarballUrl: tarball, auth })
			writeShasumToModuleInfo(shasum, DEV_DIR)

			logger.info(`${packageName} installed in ${DEV_DIR}`)

			createSymlink(DEV_DIR)
		} else {
			logger.info(
				`Version of ${packageName} in ${DEV_DIR} matches the npm version, skipping installation`,
			)
		}
	} catch (error) {
		logger.error(error)
		process.exit(1)
	}
}
