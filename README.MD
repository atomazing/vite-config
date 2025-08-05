# 📚 Table of Contents

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Usage](#3-usage)

## 1. Introduction

### 🔧 What’s Included

Provides a vite configuration with PWA, module-federation and i8n support. Also included typescript configuration.

---

## 2. Installation

To install `@atomazing-org/vite-config`, use your preferred package manager:

```bash
# npm
npm install @atomazing-org/vite-config
```

```bash
# yarn
yarn add @atomazing-org/vite-config
```

```bash
# pnpm
pnpm add @atomazing-org/vite-config
```

If you plan to use PWA features you will also need to install Workbox

```bash
	pnpm add workbox-build workbox-window
```


> **Note:** This package includes only the core functionality.  
> You must also install the required **peer dependencies** to ensure proper integration with MUI and Emotion.

## 3. Usage

### Vite config

After installing the package, a `vite.config.ts` file will be created in the root directory if it did not exist before. If you already have a `vite.config.ts` file, add the following to it:

```ts
import { createViteConfig } from '@atomazing-org/vite-config'

// https://vitejs.dev/config/
export default createViteConfig({
	moduleFederationOptions: {
		name: '{appName}',
	},
	// you also can use default vite configuration
	server: {
		port: 5000,
		proxy: {
			// proxy settings
			}
		}
})
```

createViteConfig options

```ts
enableDevPwa, // Enable to test PWA functionality in dev, but it may slow down HMR.
enableHttps, // Enable https necessary for work PWA on dev
moduleFederationOptions,
```


You can create a `manifest.ts` required for PWA to work with command:

```bash
# npm
npx @atomazing-org/vite-config create-manifest
```

You can also create your own `workbox.config.ts` or the default one will be used.

### Module Federation


If you want to use your application as a host, you will need to specify name and remotes modules. For example:

```ts
export default createViteConfig({
	moduleFederationOptions: {
		name: 'host',
		remotes: {
			remote: {
				type: 'module',
				name: 'remoteModule',
				entry: 'https://[...]/remoteEntry.js',
			},
			shared: [...librariesToShare],
		},
	},
})
```
If you want to use your application as a remote module, you will need to specify name and exposes components. For example:

```ts
export default createViteConfig({
	moduleFederationOptions: {
		name: 'remote',
		exposes: {
				'./mount': './src/mount.tsx',
			},
	},
})
```

By default, `shared` are already set for `react` and `react-dom`.
Filename by default is `remoteEntry.js`


### Typescript config

After installing the package, a `tsconfig.json` file will be created in the root directory if it did not exist before. If you already have a `tsconfig.json` file, add the following to it:

```ts
	"extends": "@atomazing-org/vite-config/configs/tsconfig.json",
```
