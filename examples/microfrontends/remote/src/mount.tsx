import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App.tsx'

export async function mount(container: Element) {

	ReactDOM.createRoot(container).render(
		<StrictMode>
				<App />
		</StrictMode>,
	)
}

export default mount
