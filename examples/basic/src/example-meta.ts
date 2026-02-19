export type FeatureStatus = 'on' | 'off'

export type ExampleFeature = {
	name: string
	status: FeatureStatus
	description: string
}

export type ExampleFile = {
	path: string
	description: string
}

export const basicExampleMeta = {
	title: 'Basic Example Showcase',
	description:
		'This page explains what the default createViteConfig setup gives you out of the box.',
	demonstrates: [
		'Basic React + Vite integration with createViteConfig',
		'How feature flags map to runtime behavior',
		'Where to edit configuration in a real project',
	],
	features: [
		{
			name: 'Module Federation',
			status: 'off',
			description: 'No remotes/exposes configured in this example.',
		},
		{
			name: 'PWA',
			status: 'off',
			description: 'manifest.ts is not present, so PWA plugin stays disabled.',
		},
		{
			name: 'HTTPS',
			status: 'off',
			description: 'Development server runs on HTTP by default.',
		},
		{
			name: 'Type checking',
			status: 'on',
			description: 'vite-plugin-checker runs TypeScript checks during development.',
		},
	] as ExampleFeature[],
	commands: ['pnpm dev', 'pnpm build', 'pnpm preview'],
	keyFiles: [
		{
			path: 'examples/basic/vite.config.ts',
			description: 'Minimal createViteConfig usage for a single app.',
		},
		{
			path: 'examples/basic/tsconfig.json',
			description: 'Extends the shared tsconfig from this package.',
		},
		{
			path: 'configs/tsconfig.json',
			description: 'Base TS rules exported by @atomazing-org/vite-config.',
		},
		{
			path: 'src/index.ts',
			description: 'Main createViteConfig implementation with plugin composition.',
		},
	] as ExampleFile[],
	nextSteps: [
		'Enable Module Federation in this example to compare with microfrontends.',
		'Create manifest.ts to activate the PWA branch in createViteConfig.',
		'Toggle enableHttps and check generated local certificate behavior.',
	],
}
