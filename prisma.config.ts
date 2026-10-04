import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --tsconfig tsconfig.json prisma/seed.ts",
  },
  datasource: {
    // Use a direct/session connection for Prisma CLI operations when supplied.
    // The app's DATABASE_URL can use Supavisor transaction mode in serverless.
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});
