import { useCallback, useEffect, useRef, useState } from 'react'
import './styles.css'

type LoadState = 'idle' | 'loading' | 'ready' | 'error'

type LogEntry = {
	id: number
	time: string
	message: string
}

const statusLabel: Record<LoadState, string> = {
	idle: 'Idle',
	loading: 'Loading',
	ready: 'Ready',
	error: 'Error',
}

const remoteEndpoint = import.meta.env.DEV
	? 'http://localhost:3001/remoteEntry.js'
	: '/remote/remoteEntry.js'

export const App = () => {
	const remoteRootRef = useRef<HTMLElement | null>(null)
	const logCounterRef = useRef(0)

	const [state, setState] = useState<LoadState>('idle')
	const [loadMs, setLoadMs] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [logEntries, setLogEntries] = useState<LogEntry[]>([])

	const pushLog = useCallback((message: string) => {
		const entry: LogEntry = {
			id: logCounterRef.current++,
			time: new Date().toLocaleTimeString(),
			message,
		}
		setLogEntries(prev => [entry, ...prev].slice(0, 30))
	}, [])

	const loadRemote = useCallback(
		async (reason: 'initial' | 'manual') => {
			setState('loading')
			setError(null)
			setLoadMs(null)
			pushLog(`Starting remote load (${reason}) from ${remoteEndpoint}`)

			const startedAt = performance.now()

			try {
				const mod = await import('remote/mount')
				pushLog('Remote module imported successfully')

				if (!remoteRootRef.current) {
					throw new Error('Remote root element is not mounted yet')
				}

				await mod.default(remoteRootRef.current)
				const duration = Math.round(performance.now() - startedAt)

				setLoadMs(duration)
				setState('ready')
				pushLog(`Remote mounted in ${duration} ms`)
			} catch (loadError) {
				const message =
					loadError instanceof Error ? loadError.message : 'Unknown error while loading remote'

				setState('error')
				setError(message)
				pushLog(`Remote load failed: ${message}`)
			}
		},
		[pushLog],
	)

	useEffect(() => {
		void loadRemote('initial')
	}, [loadRemote])

	return (
		<main className="host-shell">
			<header className="panel hero">
				<p className="eyebrow">Microfrontends Host</p>
				<h1>Host Diagnostics Dashboard</h1>
				<p>
					This host imports <code>remote/mount</code> over Module Federation and renders it into
					the runtime container.
				</p>
			</header>

			<section className="panel diagnostics-grid">
				<article className="diagnostic-card">
					<h2>Status</h2>
					<p className={`status status-${state}`}>{statusLabel[state]}</p>
					<p>{loadMs == null ? 'No successful load yet' : `Last successful load: ${loadMs} ms`}</p>
				</article>

				<article className="diagnostic-card">
					<h2>Remote Endpoint</h2>
					<code>{remoteEndpoint}</code>
					<p>{import.meta.env.DEV ? 'Development mode endpoint' : 'Production mode endpoint'}</p>
				</article>

				<article className="diagnostic-card">
					<h2>Actions</h2>
					<div className="actions">
						<button type="button" onClick={() => void loadRemote('manual')}>
							Load remote
						</button>
						<button type="button" onClick={() => void loadRemote('manual')}>
							Reload remote
						</button>
						<button type="button" onClick={() => setLogEntries([])}>
							Clear log
						</button>
					</div>
				</article>
			</section>

			{error ? (
				<section className="panel error-panel">
					<h2>Last Error</h2>
					<p>{error}</p>
					<p>Ensure remote is running on port 3001 and exposes ./mount.</p>
				</section>
			) : null}

			<section className="panel">
				<h2>Runtime Log</h2>
				<ul className="log-list">
					{logEntries.length === 0 ? (
						<li className="log-empty">No events yet.</li>
					) : (
						logEntries.map(entry => (
							<li key={entry.id}>
								<time>{entry.time}</time>
								<span>{entry.message}</span>
							</li>
						))
					)}
				</ul>
			</section>

			<section className="panel">
				<h2>Remote Render Container</h2>
				<div className="remote-frame">
					<section className="remote-root" ref={remoteRootRef} />
				</div>
			</section>
		</main>
	)
}
