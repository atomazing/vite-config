import { spawn, spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const exampleDirs = {
	basic: path.join(repoRoot, 'examples', 'basic'),
	remote: path.join(repoRoot, 'examples', 'microfrontends', 'remote'),
	host: path.join(repoRoot, 'examples', 'microfrontends', 'host'),
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const waitForHttp = async (url, timeoutMs) => {
	const startedAt = Date.now()
	while (Date.now() - startedAt < timeoutMs) {
		try {
			const controller = new AbortController()
			const timer = setTimeout(() => controller.abort(), 2000)
			const response = await fetch(url, { signal: controller.signal })
			clearTimeout(timer)

			if (response.ok) {
				return
			}
		} catch {
			// keep retrying until timeout
		}
		await delay(700)
	}
	throw new Error(`Timeout waiting for ${url}`)
}

const startDev = (cwd, args, label) => {
	console.log(`[smoke-examples] starting ${label}`)
	return spawn(pnpmCommand, args, {
		cwd,
		stdio: 'inherit',
		shell: process.platform === 'win32',
	})
}

const stopDev = child => {
	if (!child || child.exitCode !== null) {
		return
	}

	if (process.platform === 'win32') {
		spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
			stdio: 'ignore',
		})
		return
	}

	child.kill('SIGTERM')
}

const run = async () => {
	let basicProcess
	let remoteProcess
	let hostProcess

	try {
		basicProcess = startDev(
			exampleDirs.basic,
			['dev', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
			'basic',
		)
		await waitForHttp('http://127.0.0.1:5173', 45000)
		console.log('[smoke-examples] basic responded with HTTP 200')
		stopDev(basicProcess)

		remoteProcess = startDev(
			exampleDirs.remote,
			['dev', '--host', '127.0.0.1', '--port', '3001', '--strictPort'],
			'mf remote',
		)
		await waitForHttp('http://127.0.0.1:3001/remoteEntry.js', 50000)
		console.log('[smoke-examples] remoteEntry.js is reachable')

		hostProcess = startDev(
			exampleDirs.host,
			['dev', '--host', '127.0.0.1', '--port', '3000', '--strictPort'],
			'mf host',
		)
		await waitForHttp('http://127.0.0.1:3000', 50000)
		console.log('[smoke-examples] host responded with HTTP 200')
		console.log('[smoke-examples] smoke checks completed successfully.')
	} finally {
		stopDev(hostProcess)
		stopDev(remoteProcess)
		stopDev(basicProcess)
	}
}

run().catch(error => {
	console.error('[smoke-examples] failed')
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
})
