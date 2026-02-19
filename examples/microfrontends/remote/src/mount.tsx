import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'

import { App } from './App'

const roots = new WeakMap<Element, Root>()

let mountInvocations = 0
let lastMountedAt = 'never'

const getDiagnostics = () => ({
	mountInvocations,
	lastMountedAt,
})

export async function mount(container: Element) {
	mountInvocations += 1
	lastMountedAt = new Date().toISOString()

	let root = roots.get(container)
	if (!root) {
		root = createRoot(container)
		roots.set(container, root)
	}

	root.render(
		<StrictMode>
			<App diagnostics={getDiagnostics()} />
		</StrictMode>,
	)
}

export default mount
