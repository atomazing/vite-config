import { basicExampleMeta } from './example-meta'

const statusLabel = {
	on: 'Enabled',
	off: 'Disabled',
} as const

export default function App() {
	return (
		<main className="basic-shell">
			<header className="hero">
				<p className="eyebrow">Vite Config Example</p>
				<h1>{basicExampleMeta.title}</h1>
				<p>{basicExampleMeta.description}</p>
			</header>

			<section className="panel">
				<h2>What this example demonstrates</h2>
				<ul className="list">
					{basicExampleMeta.demonstrates.map(item => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</section>

			<section className="panel">
				<h2>Enabled config options</h2>
				<div className="feature-grid">
					{basicExampleMeta.features.map(feature => (
						<article className="feature-card" key={feature.name}>
							<div className="feature-header">
								<strong>{feature.name}</strong>
								<span className={`badge badge-${feature.status}`}>
									{statusLabel[feature.status]}
								</span>
							</div>
							<p>{feature.description}</p>
						</article>
					))}
				</div>
			</section>

			<section className="panel two-col">
				<div>
					<h2>Run commands</h2>
					<ul className="list code-list">
						{basicExampleMeta.commands.map(command => (
							<li key={command}>
								<code>{command}</code>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2>What to try next</h2>
					<ul className="list">
						{basicExampleMeta.nextSteps.map(item => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</section>

			<section className="panel">
				<h2>Key files</h2>
				<div className="file-grid">
					{basicExampleMeta.keyFiles.map(file => (
						<article className="file-card" key={file.path}>
							<code>{file.path}</code>
							<p>{file.description}</p>
						</article>
					))}
				</div>
			</section>
		</main>
	)
}
