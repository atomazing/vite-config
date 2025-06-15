import path from 'node:path'

export const NPM_REGISTRY = 'https://registry.npmjs.org/'
export const DEV_DIR = '.dev'
export const MODULE_ENTRYPOINT = path.resolve(process.cwd(), 'src/index.tsx')

export const EXTERNAL_DEPS = [
	'react',
	'react/jsx-runtime',
	'react-dom',
	'react-dom/client',
	'scheduler',
]

export const OUTPUT_MODULE_PREFIX = 'GENERATED_MODULE'
