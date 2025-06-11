# @atomazing/vite-config

Reusable Vite configuration utility for Atomazing's microfrontend architecture in the Super App ecosystem.

## Features

- Simplified Vite configuration via `defineModuleConfig`
- Support for host-module architecture
- Shared constants for dependency management
- Integration with TypeScript path mapping
- Externalization of common dependencies like React
- Built-in error boundaries for dynamic modules

## Installation

```bash
npm install @atomazing-org/vite-config --save-dev
```

## Usage

In your `vite.config.ts` of a module:

```ts
import { defineModuleConfig } from '@atomazing-org/vite-config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineModuleConfig({
  moduleName: 'timesheet',
  hostPackage: '@super-app/host@latest',
  plugins: [
    react(),
    tsconfigPaths()
  ],
  preview: {
    port: 3032
  }
})
```

## Constants

```ts
import {
  EXTERNAL_DEPS,
  MODULE_ENTRYPOINT,
  OUTPUT_MODULE_PREFIX,
  DEV_DIR
} from '@atomazing-org/vite-config/constants'
```

## Build

```bash
npm install
npm run build
```

## Publish

Make sure you are logged in to npm:

```bash
npm login
```

Then:

```bash
npm run deploy
```

## License

MIT
