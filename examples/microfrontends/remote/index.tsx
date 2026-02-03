import { mount } from './src/mount'

const rootElement = document.querySelector('#root')
if (!rootElement) {
	throw new Error('Root element not found')
}
mount(rootElement)
