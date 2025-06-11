import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'

import { extract } from 'tar'

import { DEV_DIR } from '../constants.ts'

interface Params {
	/** The parameters for downloading the package */
	packageTarballUrl: string
	/** The authentication token for accessing the package */
	auth: string
}

/**
 * Downloads and extracts a package from a tarball URL.
 *
 * This function fetches a package tarball from the provided URL, extracts it,
 * and places the contents in the development directory.
 */
export const downloadPackage = async ({ packageTarballUrl, auth }: Params) => {
	const headers = new Headers({ Authorization: getRegistryAuthorizationHeader(auth) })
	const response = await fetch(packageTarballUrl, { headers })

	if (!response.body) throw new Error('No response.body')

	await pipeline(
		response.body,
		createGunzip(),
		extract({
			strip: 2,
			filter: (path: string) => path.startsWith('package/dist/'),
			cwd: DEV_DIR,
		}),
	)
}

/**
 * Generates the appropriate authorization header for npm registry requests.
 *
 * @param authToken - The authentication token.
 * @returns The formatted authorization header.
 */
const getRegistryAuthorizationHeader = (authToken: string) => {
	if (authToken.startsWith('NpmToken')) return `Bearer ${authToken}`
	return `Basic ${authToken}`
}
