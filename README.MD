# @atomazing-org/vite-config

`@atomazing-org/vite-config` is a Vite configuration toolkit for React applications.
It provides a single `createViteConfig` entry point with practical defaults and optional integrations.

## Features

- React setup (`@vitejs/plugin-react`) with Emotion support
- TypeScript diagnostics in dev (`vite-plugin-checker`)
- Module Federation support (`@module-federation/vite`)
- PWA support (`vite-plugin-pwa`) with optional QR in dev
- Optional HTTPS in dev (`@vitejs/plugin-basic-ssl`)
- Optional i18n integration (`@lingui/vite-plugin`)
- Shared TypeScript config export (`configs/tsconfig.json`)

## Installation

```bash
# npm
npm install @atomazing-org/vite-config

# yarn
yarn add @atomazing-org/vite-config

# pnpm
pnpm add @atomazing-org/vite-config
```

## Install From Scratch

Requirements:

- Node.js `>=20`
- `pnpm` (recommended), `npm`, or `yarn`

### Option A: Use the library in a brand new app

1. Create a Vite React app:

```bash
pnpm create vite my-app --template react-ts
cd my-app
```

2. Install project dependencies:

```bash
pnpm install
```

3. Add `@atomazing-org/vite-config`:

```bash
pnpm add @atomazing-org/vite-config
```

4. Replace `vite.config.ts`:

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

export default createViteConfig({
	server: {
		port: 5173,
	},
})
```

5. Extend package TS config in `tsconfig.json`:

```json
{
	"extends": "@atomazing-org/vite-config/configs/tsconfig.json"
}
```

6. Run the app:

```bash
pnpm dev
```

### Option B: Set up this repository for local development

1. Clone and enter the repo:

```bash
git clone https://github.com/atomazing/vite-config.git
cd vite-config
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the library:

```bash
pnpm build
```

4. Validate examples:

```bash
pnpm check:examples
pnpm check:examples:smoke
```

5. Run examples manually (optional):

```bash
pnpm --dir examples/basic dev
pnpm --dir examples/microfrontends/remote dev
pnpm --dir examples/microfrontends/host dev
```

## Quick Start

Create `vite.config.ts`:

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

export default createViteConfig({
	server: {
		port: 5173,
	},
})
```

## Configuration API

`createViteConfig` accepts all regular Vite `UserConfig` options plus:

- `enableDevPwa?: boolean`  
  Enable PWA dev mode and QR plugin behavior.
- `enableHttps?: boolean`  
  Enable self-signed HTTPS in development.
- `enableI8n?: boolean`  
  Enable Lingui integration.
- `checkTypescript?: boolean`  
  Enable/disable TypeScript checks in dev (`true` by default).
- `moduleFederationOptions?: Partial<ModuleFederationOptions> & Pick<ModuleFederationOptions, 'name'>`  
  Module Federation setup for host/remote apps.
- `reactPluginOptions?: ReactPluginOptions`  
  Additional options forwarded to `@vitejs/plugin-react`.

## Usage Examples

### Basic

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

export default createViteConfig({
	server: {
		port: 5173,
	},
})
```

### Module Federation Host

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

export default createViteConfig({
	moduleFederationOptions: {
		name: 'host',
		remotes: {
			remote: 'remote@https://example.com/remoteEntry.js',
		},
		shared: {
			react: { singleton: true },
			'react-dom': { singleton: true },
		},
	},
})
```

### Module Federation Remote

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

export default createViteConfig({
	moduleFederationOptions: {
		name: 'remote',
		exposes: {
			'./mount': './src/mount.tsx',
		},
	},
})
```

## PWA Manifest and Workbox

Generate `manifest.ts`:

```bash
npx @atomazing-org/vite-config create-manifest
```

You can also provide your own `workbox.config.ts`.
If it is not found, the default Workbox config from this package is used.

## TypeScript Setup

Extend the shared config in your project:

```json
{
	"extends": "@atomazing-org/vite-config/configs/tsconfig.json"
}
```

## Re-Exports

In addition to `createViteConfig`, the package re-exports:

- `workbox-build`
- `workbox-window`
- `vite-plugin-pwa`

## Notes

- PWA QR output in dev appears only when `enableDevPwa: true`.
- HTTPS is enabled via `@vitejs/plugin-basic-ssl` when `enableHttps: true`.
- Config initialization logs are grouped by feature to simplify diagnostics.

## Examples

Interactive examples are available in `examples/`:

- `examples/basic` - baseline `createViteConfig` usage and feature overview.
- `examples/microfrontends/remote` - Module Federation remote exposing `./mount`.
- `examples/microfrontends/host` - Module Federation host loading `remote/mount`.

Start from:

```bash
pnpm --dir examples/basic dev
```

Microfrontends run order:

```bash
pnpm --dir examples/microfrontends/remote dev
pnpm --dir examples/microfrontends/host dev
```

Detailed docs:

- `examples/README.md`
- `examples/basic/README.md`
- `examples/microfrontends/README.md`

Gallery:

![Basic dashboard](examples/assets/basic-dashboard.png)
![Host dashboard](examples/assets/mf-host-dashboard.png)
![Remote dashboard](examples/assets/mf-remote-dashboard.png)

Regenerate screenshots:

```bash
pnpm capture:examples:screenshots
```

## Setup Behavior

The postinstall setup script (`bin/setup.mjs`) scaffolds `tsconfig.json` and `vite.config.ts` only when:

- `INIT_CWD` contains a valid `package.json`
- target project is not the `@atomazing-org/vite-config` package itself

This prevents accidental config generation in home directories and avoids parent-level `tsconfig` warnings.

## Validation Scripts

```bash
pnpm check:examples:build
pnpm check:examples:types
pnpm check:examples:smoke
pnpm check:examples
```
