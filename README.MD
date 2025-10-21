## Описание

1. [Introduction](#1-introduction)
2. [Installation](#2-installation)
3. [Usage](#3-usage)

## Описание

Набор конфигов и плагинов для Vite под React-приложения c готовой интеграцией:
- **PWA** (автообнаружение `manifest.ts`, поддержка `workbox` и QR в dev)
- **Module Federation** для микрофронтендов
- **HTTPS** (самоподписанный SSL в dev)
- **i18n** через `@lingui/vite-plugin`
- **Проверка TypeScript** через `vite-plugin-checker`
- **React** (`@vitejs/plugin-react`) с Emotion и поддержкой

## Установка

```bash
# npm
npm install @atomazing-org/vite-config

# yarn
yarn add @atomazing-org/vite-config

# pnpm
pnpm add @atomazing-org/vite-config
```

> Пакет подключает плагины автоматически, однако их peer-зависимости должны быть установлены в вашем проекте (React, Lingui при использовании i18n и т.д.).

## Конфигурация

Создайте или отредактируйте `vite.config.ts`:

### Пример: базовая конфигурация

```ts
export default createViteConfig({
    server: { port: 5173 },
})
```

### Пример: Module Federation (host)

```ts
export default createViteConfig({
    moduleFederationOptions: {
        name: 'host',
        remotes: {
            remote: 'remote@https://example.com/remoteEntry.js',
        },
        shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    },
})
```

### Пример: Module Federation (remote)

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

## PWA: manifest и Workbox

Создать `manifest.ts` можно командой:

```bash
npx @atomazing-org/vite-config create-manifest
```

Можно также создать свой `workbox.config.ts`. Если файл не найден, используется дефолтная конфигурация из пакета.

## Конфигурация TypeScript

Подключите общий `tsconfig`:

```json
{
    "extends": "@atomazing-org/vite-config/configs/tsconfig.json"
}
```

## Экспорты из пакета

Помимо `createViteConfig`, повторно экспортируются:
- `workbox-build`
- `workbox-window`
- `vite-plugin-pwa`

Это позволяет использовать их типы и утилиты напрямую из пакета.

## Примечания

- QR-код для PWA dev генерируется только при `enableDevPwa: true` и доступен для локальных IP `192.168.0.*`.
- HTTPS активируется плагином `@vitejs/plugin-basic-ssl` при `enableHttps: true`.
- Логирование инициализации конфигурации структурировано по блокам для удобства диагностики.
