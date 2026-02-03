import { useEffect, useRef } from 'react'
import "./styles.css"

export const App = ()=>  {
	const ref = useRef(null)

	useEffect(() => {
		const mount = async () => {
			const mod = await import('remote/mount')
			if (ref.current) {
				mod.default(ref.current)
			}
		}

		mount()
	}, [])

  return (
		<section className="remote" ref={ref} />
  )
}
