import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateStackBody, GetStacksQuery, GetStacksResponse, UpdateStackBody } from './schema';

export const getStacks = async (query: GetStacksQuery): Promise<GetStacksResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.StackWhereInput = {};

  if (isActive === true) where.isDeleted = false;
  else if (isActive === false) where.isDeleted = true;
  if (search) {
    where.OR = [
      { label: { contains: search, mode: 'insensitive' } },
      { key: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.stack.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.stack.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getStack = (id: string) => prisma.stack.findUnique({ where: { id } });

export const createStack = (body: CreateStackBody, userId: string) => prisma.stack.create({
  data: { ...body, createdBy: userId },
});

export const updateStack = async (id: string, body: UpdateStackBody, userId: string) => {
  const current = await prisma.stack.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Stack not found'), { statusCode: 404 });

  return prisma.stack.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
};

export const softDeleteStack = (id: string, userId: string) => prisma.stack.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
});

export const deleteStack = async (id: string, userId: string) => {
  const stack = await softDeleteStack(id, userId);
  await prisma.stack.delete({ where: { id } });
  return stack;
};
