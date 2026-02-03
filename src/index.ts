/// <reference types="vitest" />
import { defineConfig, PluginOption, UserConfig } from 'vite'
import { federation } from '@module-federation/vite'
import react, { Options as ReactPluginOptions } from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { qrcode } from 'vite-plugin-qrcode'
import defaultWorkboxConfig from '../configs/workbox.config'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tsconfigPaths from 'vite-tsconfig-paths'
import checker from 'vite-plugin-checker'
import { findTsModule } from './helpers'
import { ModuleFederationOptions } from '@module-federation/vite/lib/utils/normalizeModuleFederationOptions'
import { lingui } from '@lingui/vite-plugin'
import emotionBabelPlugin from '@emotion/babel-plugin'

type Args = {
	enableDevPwa?: boolean
	enableHttps?: boolean
	moduleFederationOptions?: Partial<ModuleFederationOptions> & Pick<ModuleFederationOptions, 'name'>
	reactPluginOptions?: ReactPluginOptions
	enableI8n?: boolean
	checkTypescript?: boolean
} & UserConfig

/**
 * Создает конфигурацию Vite с предустановленными плагинами и настройками
 * 
 * Эта функция автоматически настраивает популярные плагины для React приложений:
 * - PWA поддержка с автоматическим обнаружением manifest.ts
 * - Module Federation для микрофронтендов
 * - HTTPS с самоподписанным сертификатом
 * - Интернационализация с Lingui
 * - TypeScript проверка
 * - React с Emotion и поддержкой TypeScript путей
 * 
 * @param {Args} config - Объект конфигурации с опциональными параметрами
 * @param {boolean} [config.enableDevPwa=false] - Включить PWA в режиме разработки. Показывает QR код для локальных IP адресов
 * @param {boolean} [config.enableHttps=false] - Включить HTTPS с самоподписанным сертификатом
 * @param {boolean} [config.enableI8n=false] - Включить поддержку интернационализации с Lingui
 * @param {boolean} [config.checkTypescript=true] - Включить проверку TypeScript во время разработки
 * @param {Partial<ModuleFederationOptions> & Pick<ModuleFederationOptions, 'name'>} [config.moduleFederationOptions] - Настройки Module Federation для микрофронтендов
 * @param {ReactPluginOptions} [config.reactPluginOptions] - Дополнительные опции для React плагина
 * @param {UserConfig} config - Все остальные опции Vite конфигурации (plugins, build, resolve и т.д.)
 * 
 * @returns {Promise<UserConfig>} Полная конфигурация Vite
 * 
 * @example
 * ```typescript
 * // Базовая конфигурация
 * export default createViteConfig({
 *   // ваши настройки
 * })
 * 
 * // С PWA и HTTPS
 * export default createViteConfig({
 *   enableDevPwa: true,
 *   enableHttps: true,
 *   // другие настройки
 * })
 * 
 * // С Module Federation
 * export default createViteConfig({
 *   moduleFederationOptions: {
 *     name: 'myApp',
 *     remotes: {
 *       remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js'
 *     }
 *   }
 * })
 * ```
 * 
 * @see {@link https://vitejs.dev/config/} - Официальная документация Vite
 */
export async function createViteConfig({
	enableDevPwa = false,
	enableHttps = false,
	enableI8n = false,
	checkTypescript = true,
	moduleFederationOptions,
	reactPluginOptions,
	...userConfig
}: Args) {
	// Инициализация конфигурации
	console.log('🚀 [ViteConfig] Инициализация конфигурации Vite...')
	
	const manifest = await findTsModule('manifest.ts')
	const workboxConfig = await findTsModule('workbox.config.ts')

	const { plugins: userPlugins, build, ...restUserConfig } = userConfig
	const plugins: PluginOption[] = []
	const babelPlugins: any[] = [emotionBabelPlugin]
	

	// PWA конфигурация
	if (manifest) {
		console.log('📱 [PWA] Обнаружен manifest.ts - инициализация PWA')
		
		const workboxSource = workboxConfig ? 'custom' : 'default'
		console.log(`⚙️  [PWA] Workbox конфигурация: ${workboxSource}`)
		
		// https://vite-pwa-org.netlify.app/
		plugins.push(
			VitePWA({
				devOptions: {
					enabled: enableDevPwa,
					type: 'module',
				},

				manifest,
				registerType: 'autoUpdate',
				workbox: workboxConfig ? workboxConfig : defaultWorkboxConfig,
				includeAssets: ['**/*', 'sw.js'],
			}),
		)
		if (enableDevPwa) {
			console.log('📲 [PWA] QR код активирован для локальных IP адресов')
			plugins.push(
				qrcode({
					filter: url =>
						url.startsWith('http://192.168.0.') || url.startsWith('https://192.168.0.'),
				}),
			)
		}
		console.log('✅ [PWA] vite-plugin-pwa успешно подключен')
	} else {
		console.log('ℹ️  [PWA] manifest.ts не найден - PWA отключен')
	}

	// Module Federation конфигурация
	if (moduleFederationOptions) {
		plugins.push(
			federation({
				filename: 'remoteEntry.js',
				...moduleFederationOptions,
			}),
		)
		console.log('✅ [ModuleFederation] @module-federation/vite успешно подключен')
	} else {
		console.log('ℹ️  [ModuleFederation] Module Federation не настроен')
	}

	// HTTPS конфигурация
	if (enableHttps) {
		console.log('🔒 [HTTPS] Активация самоподписанного SSL сертификата')
		plugins.push(basicSsl())
		console.log('✅ [HTTPS] @vitejs/plugin-basic-ssl успешно подключен')
	} else {
		console.log('ℹ️  [HTTPS] HTTPS отключен - используется HTTP')
	}

	// Интернационализация (i18n)
	if (enableI8n) {
		console.log('🌍 [i18n] Инициализация интернационализации с Lingui')
		babelPlugins.push('@lingui/babel-plugin-lingui-macro')
		plugins.push(lingui())
		console.log('✅ [i18n] @lingui/vite-plugin успешно подключен')
	} else {
		console.log('ℹ️  [i18n] Интернационализация отключена')
	}

	if (checkTypescript) {
		console.log('🔍 [TypeScript] Активация проверки типов во время разработки')
		plugins.push(
			checker({
				typescript: true,
			}),
		)
		console.log('✅ [TypeScript] vite-plugin-checker успешно подключен')
	} else {
		console.log('ℹ️  [TypeScript] Проверка типов отключена')
	}

	// Финальная конфигурация
	const finalConfig = defineConfig({
		test: {
			globals: true,
		},
		plugins: [
			...plugins,
			react({
				jsxImportSource: '@emotion/react',
				babel: {
					plugins: babelPlugins,
				},
				...reactPluginOptions
			}),
			tsconfigPaths(),

			...(userPlugins ?? []),
		],
		resolve: {
			extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.mjs', '.mts'],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.code === 'SOURCEMAP_ERROR' ||
						warning.message.includes('PURE') // ignore PURE comment warning
					) {
						return
					}
					warn(warning)
				},
			},
			...build,
		},
		...restUserConfig,
	})
	console.log('🎉 [ViteConfig] Конфигурация Vite успешно создана!')
	
	return finalConfig
}

export * from 'vite-plugin-pwa'
export * from 'workbox-build'
export * from 'workbox-window'
