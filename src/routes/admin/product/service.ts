import { Prisma } from '@prisma/client';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import { CreateProductBody, GetProductsQuery, GetProductsResponse, UpdateProductBody } from './schema';

export const getProducts = async (query: GetProductsQuery): Promise<GetProductsResponse> => {
  const { offset = 0, limit = 10, search, isActive } = query;
  const where: Prisma.ProductWhereInput = {};

  if (isActive === false) where.isDeleted = true;
  else where.isDeleted = false;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    prisma.product.count({ where }),
  ]);

  return { data, meta: resolveMeta(total, offset, limit) };
};

export const getProduct = (id: string) => prisma.product.findUnique({ where: { id } });

export const createProduct = (body: CreateProductBody, userId: string) => prisma.product.create({
  data: { ...body, createdBy: userId },
});

export const updateProduct = async (id: string, body: UpdateProductBody, userId: string) => {
  const current = await prisma.product.findUnique({ where: { id } });
  if (!current) throw Object.assign(new Error('Product not found'), { statusCode: 404 });

  return prisma.product.update({
    where: { id },
    data: { ...body, updatedBy: userId, updatedAt: new Date() },
  });
};

export const softDeleteProduct = (id: string, userId: string) => prisma.product.update({
  where: { id },
  data: { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
});

export const deleteProduct = async (id: string, userId: string) => {
  const product = await softDeleteProduct(id, userId);
  await prisma.product.delete({ where: { id } });
  return product;
};
