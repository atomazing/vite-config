import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем текущий путь модуля
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const targetConfig = path.resolve(process.cwd(), '../../../tsconfig.json')

try {
	// Проверяем существование целевого конфига
	if (!fs.existsSync(targetConfig)) {
		const configContent = `{
		"extends": "@atomazing-org/vite-config/configs/tsconfig.json",
	}`
		fs.writeFileSync(targetConfig, configContent)
	}
} catch (error) {
	console.error('❌ Ошибка при установке tsconfig.json:')
	console.error(error.message)
	process.exit(2)
}
