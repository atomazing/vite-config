# Timesheet

## Команда

## Авторизация в Nexus

Добавьте следующие строки в ваш корневой файл .npmrc, чтобы аутентифицироваться в репозитории Nexus:

Для конкретных реестров:

```bash
//nexus.bpm.lanit/repository/npm-all/:_authToken=NpmToken.00000000-0000-0000-0000-000000000000
//nexus.bpm.lanit/repository/npm-releases/:_authToken=NpmToken.00000000-0000-0000-0000-000000000000
```

Или для обоих реестров:

```bash
//nexus.bpm.lanit/repository/:_authToken=NpmToken.00000000-0000-0000-0000-000000000000
```

[Подробнее](https://wiki.bpm.lanit/pages/viewpage.action?pageId=110828117)

## Требования

- `Node.js` - можно скачать его с [официального сайта](http://nodejs.org/en/), ставим версию _22.11.X и выше (LTS)_. Это потребуется для запуска сборщика. Можно проверить установленную версию, написав команду `node -v` в терминале \ консоли.
- `npm` - он должен установиться вместе с Node.js . Потребуется для установки модулей и запуска скриптов. Можете проверить установленную версию, написав команду `npm -v` в терминале \ консоли.
- `Git`

## Установка

1. Склонируйте (нужен _git_) или скачайте репозиторий:

```bash
git clone https://bitbucket.bpm.lanit/scm/kevin/super-app-module-timesheet.git
```

2. Перейдите в папку

```bash
cd super-app-module-timesheet
```

3. Установите зависимости через `npm`:

```bash
npm i
```

## Запуск

Пропишите в терминале \ консоле:

```bash
npm run dev
```

## Прочие команды

Запуск проверки кода (eslint & prettier & ts):

```bash
npm run lint
```

Сборка Docker:

```bash
docker build -t super-app-module-timesheet .
```

Запуск Docker:

```bash
docker run -p 80:80 super-app-module-timesheet
```

Проверяем `curl -i http://localhost/index.js`
