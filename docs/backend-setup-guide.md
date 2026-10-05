# Backend setup guide

This guide explains how to bring up this API from a fresh checkout, how the code is organized, and where to make common backend changes. It describes the repository as implemented today.

## Technology stack

| Area | Stack | Role |
| --- | --- | --- |
| Runtime / language | Node.js, TypeScript (strict), CommonJS | Runs and compiles the service. |
| HTTP server | Fastify 5 | Routing, hooks, request lifecycle, CORS. |
| Route schemas | TypeBox and Fastify Type Provider | Validates and types route parameters, query strings, bodies, and responses. |
| Database | PostgreSQL | Relational persistence. Supabase Postgres is supported through connection URLs. |
| ORM | Prisma 7 with `@prisma/adapter-pg` and `pg` | Schema, migrations, generated client, and database access through node-postgres. |
| Authentication | `jsonwebtoken`, bcrypt | Bearer JWT login and password hashing; optional API key auth. |
| Object storage | Supabase Storage client | Optional file upload, download, signed/public URLs, and deletion utilities. |
| API documentation | `@fastify/swagger`, `@fastify/swagger-ui` | OpenAPI document and interactive UI at `/docs`. |
| Dev tooling | `tsx`, TypeScript | Run TypeScript directly and compile production output. |

Runtime and dependency versions are declared in `package.json`; the repository does not currently pin a Node version in an `.nvmrc` or `engines` field.

## Repository layout

```text
.
+-- docs/
|   +-- backend-setup-guide.md       # This document
|   +-- frontend-api-guide/          # API consumption guides by route module
+-- prisma/
|   +-- schema/                      # Prisma schema split across *.prisma files
|   +-- migrations/                  # Ordered SQL migrations; source of deployed DB state
|   +-- scripts/                     # Reserved for database scripts
|   +-- seed.ts                      # Repeatable portfolio content seed
+-- src/
|   +-- core/                        # App config, database clients, auth, schemas, plugins
|   +-- routes/
|   |   +-- auth/                    # Login and registration
|   |   +-- admin/                   # Authenticated management APIs
|   |   +-- public/                  # Public read-only content APIs
|   |   +-- track/                   # Analytics ingestion and view counts
|   |   +-- index.ts                 # Root route registration
|   +-- utils/                       # Shared helpers
|   +-- index.ts                     # Fastify application entry point
+-- .env.example                     # Environment variable template
+-- package.json                     # Scripts and dependencies
+-- prisma.config.ts                 # Prisma schema/migration/seed configuration
+-- tsconfig.json                    # TypeScript compiler settings
```

Each feature module under `src/routes` generally has:

```text
module/
+-- index.ts       # Declares routes, schema bindings, and handlers
+-- schema.ts      # TypeBox input/output schemas and TypeScript types
+-- handler.ts     # HTTP request/response adaptation and status codes
+-- service.ts     # Database queries and domain behavior
```

Some modules have additional helpers, such as `auth/helper.ts`, `admin/user/helper.ts`, and post-specific helper files. Public and admin interfaces for the same content type are separate modules so their visibility and response selection can differ.

## Request flow and application wiring

1. `src/index.ts` creates the Fastify server and registers CORS, Swagger, the shared error handler, then the route plugin under `API_PREFIX` (defaults to `/api`).
2. `src/routes/index.ts` mounts `/auth`, `/public`, `/track`, and `/admin` route groups.
3. `src/routes/public/index.ts` marks public routes as public for the auth hook. Auth and tracking routes also set public metadata explicitly.
4. The auth plugin in `src/core/auth.ts` checks all other requests for a valid bearer JWT or configured `x-api-key` and puts a resolved user on the request.
5. Module `index.ts` binds a route to its TypeBox schemas and handler. Fastify validates declared request/response data.
6. The handler reads validated inputs, calls the module service, and sends HTTP responses. The service uses shared clients/utilities for persistence and business rules.

Admin endpoints currently authenticate requests; role and permission names are included in identity data, but the shared auth hook does not enforce fine-grained role/permission authorization.

## Local development from a fresh checkout

Prerequisites: Node.js/npm, and a reachable PostgreSQL database. Supabase can supply the database and optional storage service; local PostgreSQL also works. Use a database/schema appropriate for development because migrations change its structure.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local environment settings:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env`. Fill in at minimum `DATABASE_URL`, `JWT_SECRET`, and a sufficiently private `API_KEY` if API key authentication is needed. Set `DB_SCHEMA` to the PostgreSQL schema the app should use (default: `staging`).

3. Generate the Prisma client:

   ```bash
   npm run db:generate
   ```

4. Apply the migrations already committed in this repository:

   ```bash
   npx prisma migrate deploy
   ```

   `DATABASE_URL` is the runtime URL. Set `DIRECT_URL` when Prisma CLI operations need a separate direct/session connection; Prisma config uses `DIRECT_URL` if set and otherwise falls back to `DATABASE_URL`.

5. Optionally load the seed records:

   ```bash
   npm run db:seed
   ```

   `prisma/seed.ts` upserts selected portfolio records such as experience, gigs, stack entries, certification, and training. It is repeatable for the records it handles; it is not a complete sample database for every model.

6. Start the API:

   ```bash
   npm run dev
   ```

   The default listener is `http://0.0.0.0:3000`, and the default API prefix is `/api`. Browse to `/docs` for Swagger UI. `npm run watch` starts the watch-mode development server.

The current `README.md` still mentions `npm run db:pull`, but that script is not defined in `package.json`. Use the migration workflow above for a fresh database. `db:pull` is not an available project command.

## Environment variables

See `.env.example`; values are read by `src/core/config.ts`, Prisma config, or the relevant client.

| Variable | Purpose / default |
| --- | --- |
| `NODE_ENV` | Runtime environment; defaults to `development`. |
| `HOST` | Listener host; defaults to `0.0.0.0`. |
| `PORT` | Listener port; defaults to `3000`. |
| `API_PREFIX` | Root path for API routes; defaults to `/api`. |
| `CORS_ORIGIN` | Allowed browser origin; defaults to `http://localhost:3000`. |
| `DATABASE_URL` | PostgreSQL runtime connection string; required for DB-backed endpoints. For Supabase serverless runtimes, the example recommends its transaction pooler URL. |
| `DIRECT_URL` | Optional direct/session database URL for Prisma CLI migrations; falls back to `DATABASE_URL`. |
| `DB_SCHEMA` | PostgreSQL schema passed to the Prisma PG adapter; defaults to `staging`. |
| `DB_POOL_MAX` | Max `pg` pool connections per app process; defaults to `1`. Account for total deployed instances when selecting a value. |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Legacy/separate DB settings exposed through config. The Prisma adapter currently connects using `DATABASE_URL`; these fields do not construct its connection string. |
| `JWT_SECRET` | JWT signing/verification secret. Config has a development fallback; set a strong secret outside local development. |
| `API_KEY` | Optional shared API key accepted in `x-api-key`; disabled when empty. |
| `SUPABASE_URL` | Supabase project URL for Storage client. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase service role key. Keep secret; never expose to browser clients. |
| `SUPABASE_CONTENT_BUCKET`, `SUPABASE_MEDIA_BUCKET`, `SUPABASE_FILES_BUCKET` | Storage bucket names used by `src/core/storage.ts`. |

Supabase Storage credentials are only needed for flows that call the storage utilities. Do not commit `.env` or deployment secrets.

## Database and Prisma

- The Prisma datasource is PostgreSQL and schema files are collected from `prisma/schema/` (configured in `prisma.config.ts`).
- `prisma/schema/schema.prisma` declares the client generator and datasource provider. Model definitions are split into one file per concept, for example `user.prisma`, `post.prisma`, `experience.prisma`, and their join models.
- `prisma/migrations/` contains SQL migrations and is the source of truth for deployed database changes. Commit schema and migration together when adding/changing database fields.
- Runtime Prisma is initialized in `src/core/prisma.ts` with `PrismaPg` over a shared `pg.Pool`. The pool max is configurable and the client/pool are cached on `globalThis` for process reuse.
- Prisma CLI configuration also points to `prisma/seed.ts` for `prisma db seed`.

Common database commands:

```bash
npm run db:generate                 # regenerate @prisma/client
npx prisma migrate dev --name add_example  # create/apply a development migration
npx prisma migrate deploy           # apply committed migrations
npm run db:seed                     # execute configured seed
npm run db:push                     # push schema directly (development only)
npm run db:studio                   # open Prisma Studio
```

Prefer migrations for shared environments. `db:push` does not create a migration history entry and should not replace the team migration workflow. `npm run build` currently runs `tsc` and then `prisma migrate deploy`; deployments must therefore provide a migration-capable database URL during build, or the build/deploy pipeline should be adjusted to run migrations in a dedicated deployment step.

## Adding a route module

1. Define or update the Prisma model in `prisma/schema/` and create a migration with `npx prisma migrate dev --name <change>`; regenerate the client.
2. Add `schema.ts` with TypeBox schemas for params, query, body, and response. Reuse shared pagination and delete schemas from `src/core/schema.ts` when appropriate.
3. Add `service.ts` for database access, search/filter/sort, pagination, visibility, and data shaping.
4. Add `handler.ts` for request extraction, calling services, and explicit success/not-found status behavior.
5. Register routes in the module's `index.ts`, then mount the module in `src/routes/public/index.ts`, `src/routes/admin/index.ts`, or `src/routes/index.ts` as appropriate.
6. For admin mutations, use `resolveUser` from `src/utils` when writing audit fields. For public reads, explicitly exclude soft-deleted records and avoid returning private fields.
7. Update module docs under `docs/frontend-api-guide/modules/` with paths, auth, query/body, response, and error behavior.

Keep public and admin schema selections separate where the public contract must omit audit/private fields. Ensure a search parameter is both declared in schema and actually applied by its service before documenting it as functional.

## Build and operational notes

- `npm run build` compiles TypeScript to `dist/` and runs Prisma deploy migrations.
- `npm start` runs `dist/index.js`; compile first.
- `npm test` is currently a placeholder that exits with an error; no working test suite is configured in `package.json`.
- Swagger UI is served at `/docs`, outside the API route prefix.
- `src/core/prismaError.ts` centralizes HTTP error responses. Avoid returning internal exception details to public clients when changing error handling.
- The auth hook currently logs the Authorization header; review/redact that log before exposing production logs broadly.
- A `.vercel` directory is present, but this guide does not assume a specific production deployment runtime or pipeline.

## API endpoint guides

See [frontend API guide index](frontend-api-guide/README.md) for the endpoint consumption guides, one Markdown file per module.
