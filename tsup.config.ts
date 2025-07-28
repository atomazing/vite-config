import { defineConfig } from 'tsup'
import type { Plugin } from 'esbuild'

// Permissions setting Plugin (needed for MacOS & Linux)
const executablePlugin = (): Plugin => ({
	name: 'make-executable',
	setup(build) {
		build.onEnd(async () => {
			const { chmod } = await import('fs/promises')
			await chmod('bin/create-manifest.mjs', 0o755)
			await chmod('bin/setup.mjs', 0o755)
		})
	},
})

export default defineConfig([
	{
		entry: ['src/index.ts'], // entry point
		outDir: 'dist', // output directory
		publicDir: 'configs', // public assets directory
		format: ['esm'], // output formats (ES Modules)
		dts: true, // generate *.d.ts type declarations
		minify: true, // minify output
		clean: true, // clean output directory before build
		sourcemap: true, // generate sourcemaps (useful for debugging)
		target: 'esnext', // JavaScript target (supports modern features like async/await)
		skipNodeModulesBundle: true,
		esbuildPlugins: [executablePlugin()],
	},
	{
		entry: ['bin/*'],
		outDir: 'dist/bin',
		clean: true,
		format: ['esm'],
	},
])
