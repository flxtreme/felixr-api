import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicStacksQuery, GetPublicStacksResponse, PublicStack } from './schema';

const publicStackSelect = {
  id: true,
  label: true,
  key: true,
  color: true,
  category: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StackSelect;

export const getStacks = async (query: GetPublicStacksQuery): Promise<GetPublicStacksResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.StackWhereInput = { isDeleted: false };

  if (search) {
    where.OR = [
      { label: { contains: search, mode: 'insensitive' } },
      { key: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.stack.findMany({ where, select: publicStackSelect, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.stack.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getStack = (id: string): Promise<PublicStack | null> => prisma.stack.findFirst({
  where: { id, isDeleted: false },
  select: publicStackSelect,
});
