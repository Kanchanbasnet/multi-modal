# Multi Modal System

A monorepo backend system built with Node.js, TypeScript, and Turborepo. It includes an HTTP API and a background worker service, backed by PostgreSQL.

## Structure

```
apps/
  api/        → Express HTTP API (auth, users, health)
  worker/     → Background job processor
packages/
  db/         → Prisma client and database access
  config/     → Shared app configuration
  logger/     → Shared logger
  types/      → Shared TypeScript types
  validators/ → Shared Zod validators
```

## Tech Stack

- **Runtime**: Node.js 22
- **Language**: TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL + Prisma 7
- **Auth**: Google OAuth
- **Monorepo**: Turborepo + pnpm workspaces
- **CI**: GitHub Actions
- **Deployment**: Railway (Docker)

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- PostgreSQL

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.sample .env
# Fill in the values in .env

# Run database migrations
pnpm --filter @repo/database exec prisma migrate dev

# Start all services in development
pnpm dev
```

## Environment Variables

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string         |
| `NODE_ENV`             | `development` or `production`        |
| `PORT`                 | API server port (default: 3000)      |
| `BASE_URL`             | Public URL of the API                |
| `FRONTEND_URL`         | URL of the frontend app              |
| `ALLOWED_ORIGINS`      | Comma-separated CORS allowed origins |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret           |
| `GOOGLE_CALLBACK_URL`  | Google OAuth callback URL            |

## Running with Docker

```bash
# Start all services (API + Worker + PostgreSQL)
docker compose up

# Rebuild from scratch
docker compose build --no-cache
docker compose up
```

## Available Scripts

```bash
pnpm dev          # Start all services in watch mode
pnpm build        # Build all packages
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

## CI/CD

GitHub Actions runs on every push to `main`:

- Checks code formatting (Prettier)
- Lints all packages (ESLint)
- Builds all packages (TypeScript)

## Deployment

The app is deployed on [Railway](https://railway.app) using Docker.

- `apps/api/Dockerfile` → API service
- `apps/worker/Dockerfile` → Worker service
- PostgreSQL is provisioned as a Railway managed database
