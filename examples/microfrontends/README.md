# Microfrontends Examples

This folder contains a host/remote pair that demonstrates Module Federation with `@atomazing-org/vite-config`.

## Architecture

1. `remote`
Exposes `./mount` from `examples/microfrontends/remote/src/mount.tsx`.

2. `host`
Imports `remote/mount` and mounts remote UI into a runtime container.

## Run order

1. Start remote:
```bash
pnpm --dir examples/microfrontends/remote dev
```

2. Start host:
```bash
pnpm --dir examples/microfrontends/host dev
```

3. Open host:
`http://127.0.0.1:3000`

## Runtime flow

1. Host tries to import `remote/mount`.
2. Remote module is fetched from `http://127.0.0.1:3001/remoteEntry.js` in development.
3. Host calls remote `mount(container)` and remote renders inside host.

## Troubleshooting

1. Port conflict:
Check ports `3000` (host) and `3001` (remote).

2. Remote unavailable:
Host dashboard should switch to `error` and show the latest load failure reason.

3. Wrong remote URL:
Check `examples/microfrontends/host/vite.config.ts` and confirm current mode mapping.
