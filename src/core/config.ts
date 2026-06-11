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
  },
  apiKey: process.env.API_KEY ?? "",
  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  },
};