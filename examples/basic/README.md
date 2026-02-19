# Basic Example

## Purpose

This example demonstrates the minimal way to use `createViteConfig` in a regular React app.

## What is enabled

1. Type checking:
`vite-plugin-checker` is enabled by default.

## What is disabled

1. Module Federation:
No federation options are passed in this example.

2. PWA:
There is no `manifest.ts`, so PWA is not activated.

3. HTTPS:
`enableHttps` is not enabled, so dev server uses HTTP.

## Key files

1. `examples/basic/vite.config.ts`
Minimal `createViteConfig` usage.

2. `examples/basic/tsconfig.json`
Extends package-level TS config.

3. `configs/tsconfig.json`
Shared TS baseline exported by this library.

4. `src/index.ts`
`createViteConfig` implementation.

## Commands

```bash
pnpm --dir examples/basic dev
pnpm --dir examples/basic build
pnpm --dir examples/basic preview
```
