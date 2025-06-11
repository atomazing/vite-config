import path from 'node:path'
import fs from 'node:fs'

import { logger } from '../util/logger.ts'
import { OUTPUT_MODULE_PREFIX } from '../constants.ts'

import type { Plugin } from 'vite'

export const createEntrypointPlugin = (): Plugin => ({
	name: 'create-entrypoint',
	apply: 'build',
	closeBundle() {
		try {
			const outputDirPath = path.join(process.cwd(), 'dist')
			const files = fs.readdirSync(outputDirPath)

			const generatedFile = files.find(
				(file) => file.startsWith(OUTPUT_MODULE_PREFIX) && file.endsWith('.js'),
			)
			if (!generatedFile) throw new Error('Generated file not found')

			const indexPath = path.join(outputDirPath, 'index.js')
			const content = `export { default } from './${generatedFile}';\n`
			fs.writeFileSync(indexPath, content, 'utf8')

			logger.info(`index.js entrypoint created successfully - ${generatedFile}`)
		} catch (error) {
			logger.error(error)
		}
	},
})
