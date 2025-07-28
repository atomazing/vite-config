import fs from 'fs'
import path from 'path'
import { transform } from 'esbuild'
import asyncFs from 'node:fs/promises'

export const findFile = (fileName: string): string | null => {
	const rootDir = process.cwd()
	const filePath = path.join(rootDir, fileName)
	if (fs.existsSync(filePath)) {
		return filePath
	}
	return null
}

export const findTsModule = async (fileName: string) => {
	const foundPath = findFile(fileName)
	if (!foundPath) return null
	try {
		const tsCode = await asyncFs.readFile(foundPath, 'utf-8')

		// Транспилируем TypeScript в JavaScript
		const { code: jsCode } = await transform(tsCode, {
			loader: 'ts',
			format: 'esm',
			target: 'esnext',
		})

		// Создаем data URL для импорта
		const dataUrl = `data:text/javascript;base64,${Buffer.from(jsCode).toString('base64')}`
		const module = await import(dataUrl)
		return module.default
	} catch (e) {
		console.error(`Error on ${fileName} loading.`, e)
		return null
	}
}
