import path from 'node:path'
import fs from 'node:fs'
import process from 'node:process'

import { logger } from '../util/logger.ts'

const USER_WORKING_DIR = 'src'

/**
 * Creates a symbolic link (symlink) between a source directory and a development directory.
 *
 * This function creates a symlink from the user's working directory (typically 'src')
 * to a specified development directory. It's useful for setting up development
 * environments where you want to link source files to a different location.
 * @param devDir - The path to the development directory where the symlink will be created.
 * @param userDir - The user's working directory (defaults to 'src').
 */
export const createSymlink = (devDir: string, userDir = USER_WORKING_DIR) => {
	try {
		const devSrcPath = path.join(process.cwd(), devDir, userDir)
		const srcPath = path.join(process.cwd(), userDir)

		fs.symlinkSync(srcPath, devSrcPath, 'junction')

		logger.info(`Symlink created from ${srcPath} to ${devSrcPath}`)
	} catch {
		logger.error('Error creating symlink')
	}
}
