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

> **Note:** This package includes only the core functionality.  
> You must also install the required **peer dependencies** to ensure proper integration with MUI and Emotion.

## 3. Usage

### Vite config

After installing the package, you can create a `manifest.ts` required for PWA to work.

```bash
# npm
npx @atomazing-org/vite-config create-manifest
```
You can also create your own `workbox.config.ts`  or the default one will be used.

### Typescript config

After installing the package, a `tsconfig.json` file will be created in the root directory if it did not exist before. If you already have a `tsconfig.json` file, add the following to it:

```ts
	"extends": "@atomazing-org/vite-config/configs/tsconfig.json",
```

