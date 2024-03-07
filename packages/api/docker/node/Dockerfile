FROM node:lts-bullseye-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app

WORKDIR /app

FROM base

ENV NODE_ENV development
ENV PORT 3000
EXPOSE 3000

RUN pnpm install

CMD ["pnpm", "dev"]