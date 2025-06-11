import { defineConfig } from 'tsup'

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		constants: 'src/constants.ts',
	},
	format: 'esm',
	clean: true,
	dts: true,
})
