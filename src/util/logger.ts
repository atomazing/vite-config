import { bold, cyan, red, gray, dim } from 'colorette'

class Logger {
	static #name = bold(cyan('[@atomazing-org/vite-config]'))
	static get #timestamp() {
		const timeFormat = new Intl.DateTimeFormat('en', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})

		return dim(gray(timeFormat.format(Date.now())))
	}

	info(msg: string) {
		console.log(`${Logger.#timestamp} ${Logger.#name} ${msg}`)
	}

	error(error: unknown) {
		if (error instanceof Error) {
			console.log(
				`${Logger.#timestamp} ${Logger.#name} ${bold(red(`[ERROR (${error.name})]`))} - ${red(error.message)}`,
			)
			if (error.cause) console.log(`\n\n${error.cause}`)
		} else {
			console.log(
				`${Logger.#timestamp} ${Logger.#name} ${bold(red('[ERROR]'))} - ${red(String(error))}`,
			)
		}
	}
}

export const logger = new Logger()
