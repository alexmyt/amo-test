## Тестовое задание для getAmo
**Требования:**

Реализовать метод, который принимает GET запрос с обязательными параметрами:

- name **TEXT** - ФИО клиента
- email **TEXT** - Email почта
- phone **TEXT** - Номер телефона

Используя эти данные, необходимо найти контакт в AmoCRM с данной почтой и/или телефоном. Если такого нет, создать новый, заполнив имя, телефон и почту. Если найден, обновить его входящими данными. После, создать сделку по данному контакту в первом статусе воронки.

## .env
```
APP_PORT=3001
APP_URL="https://****.ngrok-free.app"

AMO_URI="https://****.amocrm.ru"
INTEGRATION_ID="****"
INTEGRATION_SECRET="****"
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

