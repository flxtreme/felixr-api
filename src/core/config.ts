import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? '0.0.0.0',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? '/api',
  jwtSecret: process.env.JWT_SECRET ?? 'supersecret',
  database: {
    url: process.env.DATABASE_URL ?? "",
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    dbname: process.env.DB_NAME ?? "postgres",
    schema: process.env.DB_SCHEMA ?? "staging",
    // Keep per-instance usage low for serverless deployments; raise only after
    // accounting for the database/pooler limit and the number of app instances.
    poolMax: Number.parseInt(process.env.DB_POOL_MAX ?? "1", 10),
  },
  apiKey: process.env.API_KEY ?? "",
  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    buckets: {
      content: process.env.SUPABASE_CONTENT_BUCKET ?? "",
      media: process.env.SUPABASE_MEDIA_BUCKET ?? "",
      files: process.env.SUPABASE_FILES_BUCKET ?? "",
    }
  },
};
