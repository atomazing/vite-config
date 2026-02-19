import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const examples = [
	{ name: 'basic', dir: path.join(repoRoot, 'examples', 'basic') },
	{ name: 'mf-remote', dir: path.join(repoRoot, 'examples', 'microfrontends', 'remote') },
	{ name: 'mf-host', dir: path.join(repoRoot, 'examples', 'microfrontends', 'host') },
]

const mode = process.argv[2] ?? 'all'

const run = (cwd, args) => {
	const child = spawnSync(pnpmCommand, args, {
		cwd,
		stdio: 'inherit',
		shell: process.platform === 'win32',
	})

	if (child.error) {
		throw child.error
	}

	if (child.status !== 0) {
		throw new Error(`Command failed in ${cwd}: ${pnpmCommand} ${args.join(' ')}`)
	}
}

const runBuildChecks = () => {
	console.log('\n[check-examples] Running build checks...')
	for (const example of examples) {
		console.log(`\n[check-examples] build -> ${example.name}`)
		run(example.dir, ['build'])
	}
}

const runTypeChecks = () => {
	console.log('\n[check-examples] Running type checks...')
	for (const example of examples) {
		console.log(`\n[check-examples] tsc -> ${example.name}`)
		run(example.dir, ['exec', 'tsc', '--noEmit', '-p', 'tsconfig.json'])
	}
}

try {
	if (mode === 'build') {
		runBuildChecks()
	} else if (mode === 'types') {
		runTypeChecks()
	} else if (mode === 'all') {
		runBuildChecks()
		runTypeChecks()
	} else {
		throw new Error(`Unknown mode "${mode}". Use: build | types | all`)
	}

	console.log('\n[check-examples] Completed successfully.')
} catch (error) {
	console.error('\n[check-examples] Failed.')
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
}
