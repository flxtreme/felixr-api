import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateGigBody, GetGigsQuery, GetGigsResponse, UpdateGigBody } from './schema';

export const getGigs = async (query: GetGigsQuery): Promise<GetGigsResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.GigWhereInput = {};

  if (isActive === false) where.isDeleted = true;
  else where.isDeleted = false;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.gig.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.gig.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getGig = (id: string) => prisma.gig.findUnique({ where: { id } });

export const createGig = (body: CreateGigBody, userId: string) => prisma.gig.create({
  data: { ...body, createdBy: userId },
});

export const updateGig = async (id: string, body: UpdateGigBody, userId: string) => {
  const current = await prisma.gig.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Gig not found'), { statusCode: 404 });

  return prisma.gig.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
};

export const softDeleteGig = (id: string, userId: string) => prisma.gig.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
});

export const deleteGig = async (id: string, userId: string) => {
  const gig = await softDeleteGig(id, userId);
  await prisma.gig.delete({ where: { id } });
  return gig;
};
