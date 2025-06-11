import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import * as v from 'valibot'

const MODULE_INFO_FILENAME = 'metaInfo.json'

const moduleInfoSchema = v.object({
	shasum: v.string(),
})

/**
 * Reads the shasum from metaInfo.json if it exists.
 * @param dir - The directory where the metaInfo.json file is located.
 * @returns The shasum or null if the file doesn't exist or is invalid.
 */
export const readShasumFromModuleInfo = (dir: string) => {
	const filePath = join(dir, MODULE_INFO_FILENAME)

	try {
		const data = readFileSync(filePath, 'utf-8')
		const jsonData = JSON.parse(data)
		const metaInfo = v.parse(moduleInfoSchema, jsonData)
		return metaInfo.shasum || null
	} catch {
		return null
	}
}

/**
 * Writes the shasum to a metaInfo.json file inside the specified directory.
 * @param dir - The directory where the metaInfo.json file will be created.
 * @param shasum - The shasum value to write.
 */
export const writeShasumToModuleInfo = (shasum: string, dir: string) => {
	const filePath = join(dir, MODULE_INFO_FILENAME)
	const metaInfo = { shasum }

	try {
		writeFileSync(filePath, JSON.stringify(metaInfo, null, 2))
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error writing shasum to metaInfo.json: ${error.message}`)
		}

		throw error
	}
}
