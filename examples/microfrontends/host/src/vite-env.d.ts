/// <reference types="vite/client" />

declare module 'remote/mount' {
	const mount: (container: Element) => void | Promise<void>
	export default mount
}
