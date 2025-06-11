import { promisify } from 'node:util'
import { exec } from 'node:child_process'

import * as v from 'valibot'

const packageDistSchema = v.object({
	integrity: v.string(),
	shasum: v.string(),
	tarball: v.string(),
})

const execAsync = promisify(exec)

/**
 * Retrieves package information from npm registry.
 *
 * This function executes an npm command to fetch distribution information
 * for a specified package and parses the result.
 * @param packageName - The name of the package to retrieve information for.
 * @returns The parsed package distribution information.
 */
export const getPackageInfo = async (packageName: string) => {
	try {
		const { stdout: json } = await execAsync(`npm view ${packageName} dist --json`)
		const jsonPackageInfo = JSON.parse(json)
		return v.parse(packageDistSchema, jsonPackageInfo)
	} catch (error) {
		console.error(`Error reading package information: ${packageName}`)
		throw error
	}
}
