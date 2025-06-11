import getRegistryAuthToken from 'registry-auth-token'

/**
 * Retrieves the authentication token for a given npm registry.
 *
 * This function attempts to find the authentication token in the .npmrc file
 * for the specified npm registry.
 * @param npmRegistryUrl - The npm registry URL to get the auth token for
 * @returns The authentication token for the specified registry.
 */
export const getAuth = (npmRegistryUrl: string) => {
	const data = getRegistryAuthToken(npmRegistryUrl)
	const auth = data?.token

	if (!auth) {
		throw new Error(`Failed to find authentication token in .npmrc for registry: ${npmRegistryUrl}`)
	}

	return auth
}
