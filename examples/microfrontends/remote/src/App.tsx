import './styles.css'

export type RemoteDiagnostics = {
	mountInvocations: number
	lastMountedAt: string
}

type Props = {
	diagnostics: RemoteDiagnostics
}

export const App = ({ diagnostics }: Props) => {
	return (
		<main className="remote-shell">
			<header>
				<p className="eyebrow">Microfrontends Remote</p>
				<h1>Remote Module</h1>
				<p>This application is exposed through Module Federation and mounted by the host.</p>
			</header>

			<section className="remote-panel">
				<h2>Exposed entry</h2>
				<code>./mount -&gt; ./src/mount.tsx</code>
				<p>Host imports it as: <code>import('remote/mount')</code></p>
			</section>

			<section className="remote-panel">
				<h2>Mount diagnostics</h2>
				<ul>
					<li>
						<strong>Mount invocations:</strong> {diagnostics.mountInvocations}
					</li>
					<li>
						<strong>Last mounted at:</strong> {diagnostics.lastMountedAt}
					</li>
				</ul>
			</section>
		</main>
	)
}
