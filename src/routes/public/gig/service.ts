import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicGigsQuery, GetPublicGigsResponse, PublicGig } from './schema';

const publicGigSelect = {
  id: true,
  title: true,
  description: true,
  details: true,
  link: true,
  linkLabel: true,
  external: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.GigSelect;

export const getGigs = async (query: GetPublicGigsQuery): Promise<GetPublicGigsResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.GigWhereInput = { isDeleted: false };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.gig.findMany({ where, select: publicGigSelect, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.gig.count({ where }),
  ]);
  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getGig = (id: string): Promise<PublicGig | null> => prisma.gig.findFirst({
  where: { id, isDeleted: false },
  select: publicGigSelect,
});
