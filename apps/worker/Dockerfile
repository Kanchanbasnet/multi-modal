FROM node:22-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

COPY apps/worker/package.json  ./apps/worker/

COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/logger/package.json ./packages/logger/
COPY packages/types/package.json ./packages/types/
COPY packages/validators/package.json ./packages/validators/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/db/prisma ./packages/db/prisma/
COPY packages/db/prisma.config.ts ./packages/db/

RUN pnpm install --frozen-lockfile

COPY . .


CMD ["pnpm", "--filter", "@repo/worker", "exec", "tsx", "src/index.ts"]
