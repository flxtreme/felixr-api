import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from './config';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const pool = new pg.Pool({
  connectionString: config.database.url,
});

const adapter = new PrismaPg(pool, {
  schema: config.database.schema
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}