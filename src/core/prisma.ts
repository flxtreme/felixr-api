import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from './config';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: pg.Pool;
};

const pool = globalForPrisma.pgPool ?? new pg.Pool({
  connectionString: config.database.url,
  max: Number.isFinite(config.database.poolMax) && config.database.poolMax > 0
    ? config.database.poolMax
    : 1,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
});

const adapter = new PrismaPg(pool, {
  schema: config.database.schema
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

globalForPrisma.pgPool = pool;
globalForPrisma.prisma = prisma;
