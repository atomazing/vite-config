#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { input, confirm } from '@inquirer/prompts'
import { fileURLToPath } from 'url'

// Получаем текущий путь модуля
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Шаблон для manifest.ts
const manifestTemplate = `import type { ManifestOptions } from 'vite-plugin-pwa'
	const manifest: Partial<ManifestOptions> = {
  name: '{{name}}',
  short_name: '{{short_name}}',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  theme_color: '#7764E8',
  background_color: '#171D34',
  description: '{{description}}',
  categories: ['utilities'],
  edge_side_panel: { preferred_width: 500 },
	icons: []
};

export default manifest;
`

// Основная функция
async function createManifest() {
	console.log('\n🚀 PWA Manifest Generator\n')

	try {
		// Запрашиваем данные у пользователя
		const name = await input({
			message: 'Enter app name:',
			validate: value => (value.trim() ? true : 'App name cannot be empty'),
		})

		const shortName = await input({
			message: 'Enter short name (max 12 characters):',
			validate: value => {
				if (!value.trim()) return 'Short name cannot be empty'
				if (value.length > 12) return 'Must be 12 characters or less'
				return true
			},
		})

		const description = await input({
			message: 'Enter app description:',
			default: 'My Progressive Web App',
		})

		// Генерация содержимого файла
		const content = manifestTemplate
			.replace(/{{name}}/g, name)
			.replace(/{{short_name}}/g, shortName)
			.replace(/{{description}}/g, description)

		// Показываем предпросмотр
		console.log('\n📝 Manifest preview:')
		console.log(content)

		// Подтверждение создания файла
		const proceed = await confirm({
			message: 'Create manifest.ts?',
			default: true,
		})

		if (!proceed) {
			console.log('\n❌ Operation cancelled')
			process.exit(0)
		}

		// Определение пути сохранения
		const filePath = path.join(process.cwd(), 'manifest.ts')

		// Запись файла
		fs.writeFileSync(filePath, content)

		console.log('\n✅ manifest.ts successfully created!')
		console.log(`📍 Location: ${filePath}`)
	} catch (error) {
		if (error.message === 'User force closed the prompt') {
			console.log('\n❌ Operation cancelled')
		} else {
			console.error('\n❌ Error:', error.message)
		}
		process.exit(1)
	}
}

// Запуск процесса
createManifest()
