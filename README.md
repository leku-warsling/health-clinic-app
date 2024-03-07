### Initial Backend Setup

In the terminal from project root cd into /packages/api
run nvm use / nvm install to get the correct node version
but latest version should be fine if node version manager
not setup

```
pnpm start
```

When the Container is up run these commands

run from the container

copy .env.example file to .env

```
cp .env.example .env
docker-compose exec pnpm run migrate
docker-compose exec pnpm run db:seed
```

or run from terminal or container terminal

```
cp .env.example .env
pnpm run migrate
pnpm run db:seed
```

There are some simple endpoint tests wi

```
docker-compose exec pnpm run test

```

or run from terminal or container terminal

```
pnpm run test
```

You Should now be able to see JSON payloads for these two endpoints

```
open http://localhost:3000/api/v1/clinics
open http://localhost:3000/api/v1/patients
```

### Initial Frontend Setup

In the terminal from project root cd into /packages/client
run nvm use / nvm install to get the correct node version
but latest version should be fine if node version manager
not setup

```
pnpm install
pnpm dev
```

```
open http://localhost:5173
```
