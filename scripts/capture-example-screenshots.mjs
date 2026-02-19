import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const edgeBinary = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

if (!fs.existsSync(edgeBinary)) {
	console.error(`[capture-screenshots] Edge binary is missing: ${edgeBinary}`)
	process.exit(1)
}

const exampleDirs = {
	basic: path.join(repoRoot, 'examples', 'basic'),
	remote: path.join(repoRoot, 'examples', 'microfrontends', 'remote'),
	host: path.join(repoRoot, 'examples', 'microfrontends', 'host'),
}

const screenshotsDir = path.join(repoRoot, 'examples', 'assets')
fs.mkdirSync(screenshotsDir, { recursive: true })

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const waitForHttp = async (url, timeoutMs) => {
	const startedAt = Date.now()
	while (Date.now() - startedAt < timeoutMs) {
		try {
			const controller = new AbortController()
			const timer = setTimeout(() => controller.abort(), 2500)
			const response = await fetch(url, { signal: controller.signal })
			clearTimeout(timer)
			if (response.ok) {
				return
			}
		} catch {
			// retry until timeout
		}
		await delay(700)
	}
	throw new Error(`Timeout waiting for ${url}`)
}

const startDev = (cwd, args, label) => {
	console.log(`[capture-screenshots] starting ${label}`)
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
		spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' })
		return
	}
	child.kill('SIGTERM')
}

const capture = (url, outputFile) => {
	const outputPath = path.join(screenshotsDir, outputFile)
	const args = [
		'--headless',
		'--disable-gpu',
		'--hide-scrollbars',
		'--window-size=1440,960',
		'--virtual-time-budget=7000',
		`--screenshot=${outputPath}`,
		url,
	]

	const result = spawnSync(edgeBinary, args, { stdio: 'inherit' })
	if (result.error) {
		throw result.error
	}
	if (result.status !== 0) {
		throw new Error(`Failed to capture screenshot for ${url}`)
	}
	console.log(`[capture-screenshots] saved ${outputPath}`)
}

const run = async () => {
	let basicProcess
	let remoteProcess
	let hostProcess

	try {
		basicProcess = startDev(exampleDirs.basic, ['dev', '--host', '127.0.0.1', '--port', '5173', '--strictPort'], 'basic')
		await waitForHttp('http://127.0.0.1:5173', 50000)
		capture('http://127.0.0.1:5173', 'basic-dashboard.png')
		stopDev(basicProcess)
		basicProcess = undefined

		remoteProcess = startDev(exampleDirs.remote, ['dev', '--host', '127.0.0.1', '--port', '3001', '--strictPort'], 'mf remote')
		await waitForHttp('http://127.0.0.1:3001', 50000)
		capture('http://127.0.0.1:3001', 'mf-remote-dashboard.png')

		hostProcess = startDev(exampleDirs.host, ['dev', '--host', '127.0.0.1', '--port', '3000', '--strictPort'], 'mf host')
		await waitForHttp('http://127.0.0.1:3000', 50000)
		capture('http://127.0.0.1:3000', 'mf-host-dashboard.png')

		console.log('[capture-screenshots] done')
	} finally {
		stopDev(hostProcess)
		stopDev(remoteProcess)
		stopDev(basicProcess)
	}
}

run().catch(error => {
	console.error('[capture-screenshots] failed')
	console.error(error instanceof Error ? error.message : error)
	process.exit(1)
})
