import fs from 'fs'
import path from 'path'

const tsConfigTarget = path.resolve(process.cwd(), '../../../tsconfig.json')
const viteConfigTarget = path.resolve(process.cwd(),'../../../vite.config.ts')

try {
	if (!fs.existsSync(tsConfigTarget)) {
		const configContent = `{
		"extends": "@atomazing-org/vite-config/configs/tsconfig.json",
	}`
		fs.writeFileSync(tsConfigTarget, configContent)
	}
	if (!fs.existsSync(viteConfigTarget)) {
		const configContent = `import { createViteConfig } from '@atomazing-org/vite-config'

// https://vitejs.dev/config/
export default createViteConfig({
	moduleFederationOptions: {
		name: 'app',
	},
})`
		fs.writeFileSync(viteConfigTarget, configContent)
	}
} catch (error) {
	console.error('❌ Error installing configs:')
	console.error(error.message)
	process.exit(2)
}
