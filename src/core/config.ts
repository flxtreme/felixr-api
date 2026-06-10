import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? 'localhost',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? '/api',
  jwtSecret: process.env.JWT_SECRET ?? 'supersecret',
  database: {
    url: process.env.DATABASE_URL ?? ""
  },
  apiKey: process.env.API_KEY ?? ""
};
