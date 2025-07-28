import type { GenerateSWOptions } from 'workbox-build/build/types'

const workbox: Partial<GenerateSWOptions> = {
	globPatterns: ['assets/**/*.{js,css}', 'index.html', 'favicon.svg', 'manifest.webmanifest'],
	globIgnores: ['**/@mui/icons-material/**', '**/node_modules/**'],
	skipWaiting: true,
	clientsClaim: true,
	navigateFallback: '/index.html',
	runtimeCaching: [
		{
			// ✅ Локальный API или внешние API (если нужно)
			urlPattern: ({ url }) => url.href.startsWith('https://'),
			handler: 'NetworkFirst',
			options: {
				cacheName: 'jsonplaceholder',
				networkTimeoutSeconds: 5,
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 7 * 24 * 60 * 60,
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			// ✅ Скрипты, стили, воркеры (локальные)
			urlPattern: ({ request }) =>
				request.destination === 'script' ||
				request.destination === 'style' ||
				request.destination === 'worker',
			handler: 'CacheFirst',
			options: {
				cacheName: 'app-assets',
				expiration: {
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			// ✅ Документы навигации (страницы)
			urlPattern: ({ request }) => request.mode === 'navigate',
			handler: 'NetworkFirst',
			options: {
				cacheName: 'documents',
				networkTimeoutSeconds: 10,
				expiration: {
					maxEntries: 50,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				},
			},
		},
		{
			// ✅ Локальные изображения
			urlPattern: ({ request }) => request.destination === 'image',
			handler: 'CacheFirst',
			options: {
				cacheName: 'images',
				expiration: {
					maxEntries: 60,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
	],
}

export default workbox
