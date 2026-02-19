import fs from 'fs'
import path from 'path'

const PACKAGE_NAME = '@atomazing-org/vite-config'
const initCwd = process.env.INIT_CWD || process.cwd()
const packageJsonTarget = path.resolve(initCwd, 'package.json')
const tsConfigTarget = path.resolve(initCwd, 'tsconfig.json')
const viteConfigTarget = path.resolve(initCwd, 'vite.config.ts')

const shouldScaffold = () => {
	if (!fs.existsSync(packageJsonTarget)) {
		return false
	}

	try {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonTarget, 'utf8'))
		return packageJson?.name !== PACKAGE_NAME
	} catch {
		return false
	}
}

const ensureFile = (target, content) => {
	if (!fs.existsSync(target)) {
		fs.writeFileSync(target, content)
	}
}

try {
	if (!shouldScaffold()) {
		process.exit(0)
	}

	ensureFile(
		tsConfigTarget,
		`{
	"extends": "@atomazing-org/vite-config/configs/tsconfig.json"
}
`,
	)

	ensureFile(
		viteConfigTarget,
		`import { createViteConfig } from '@atomazing-org/vite-config'

// https://vitejs.dev/config/
export default createViteConfig({
	moduleFederationOptions: {
		name: 'app',
	},
})
`,
	)
} catch (error) {
	console.error('Error installing configs:')
	console.error(error.message)
	process.exit(2)
}
