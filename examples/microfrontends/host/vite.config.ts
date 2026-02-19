import { defineConfig } from 'vite'
import { createViteConfig } from '@atomazing-org/vite-config'

export default defineConfig(({ mode }) => {

	return createViteConfig({
		server: {
			port: 3000,
		},
		moduleFederationOptions: {
			name: 'host',
			filename: 'remoteEntry.js',
			remotes: {
				'remote': {
					type: 'module',
					name: 'remote',
					entry: mode === 'development' ?
						'http://localhost:3001/remoteEntry.js'  // URL pampa-front-new (в dev режиме она на отдельном порту)
						: '/remote/remoteEntry.js', // Относительный путь pampa-front-new (в prod режиме оба приложения на одном порту)
				},
			}
		},
	})
})
