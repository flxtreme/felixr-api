import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { GetPublicProductsQuery, GetPublicProductsResponse, PublicProduct } from './schema';

const publicProductSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  category: true,
  image: true,
  link: true,
  actionType: true,
  actionLabel: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export const getProducts = async (query: GetPublicProductsQuery): Promise<GetPublicProductsResponse> => {
  const { offset = 0, limit = 10, search } = query;
  const where: Prisma.ProductWhereInput = { isDeleted: false };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, select: publicProductSelect, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.product.count({ where }),
  ]);

  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getProduct = (id: string): Promise<PublicProduct | null> => prisma.product.findFirst({
  where: { id, isDeleted: false },
  select: publicProductSelect,
});
