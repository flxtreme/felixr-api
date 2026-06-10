import { resolveMeta } from '../../../utils';
import {
  CreateTagBody,
  UpdateTagBody,
  GetTagsQuery,
  GetTagsResponse,
  Tag,
} from './schema';
import { prisma } from '../../../core/prisma';
import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';

export const getTags = async (query: GetTagsQuery): Promise<GetTagsResponse> => {
  const { offset, limit, search, isActive } = query;

  const where: Prisma.TagWhereInput = {};

  if (isBoolean(isActive) && isActive === true) {
    where.isDeleted = false;
  } else if (isBoolean(isActive) && isActive === false) {
    where.isDeleted = true;
  }

  if (!isEmpty(search)) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { id: { contains: search, mode: 'insensitive' as const } },
        ]
      }
    ];
  }

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.tag.count({ where })
  ]);

  return {
    data: tags.map((tag) => ({ ...tag, count: tag._count.posts })),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getTag = async (id: string): Promise<Tag | null> => {
  const tag = await prisma.tag.findUnique({
    where: { id, isDeleted: false }
  });
  
  return tag;
};

export const createTag = async (body: CreateTagBody, userId: string): Promise<Tag | null> => {
  const tag = await prisma.tag.create({
    data: body
  })
  
  return tag
};

export const updateTag = async (id: string, body: UpdateTagBody, userId: string): Promise<Tag | null> => {
  const tag = await prisma.tag.update({
    where: { id },
    data: body
  });

  return tag;
};

export const softDeleteTag = async (id: string, userId: string): Promise<Tag | null> => {
  const tag = await prisma.tag.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
      deletedBy: userId,
    }
  });

  return tag;
};

export const deleteTag = async (id: string, userId: string): Promise<Tag | null> => {
  const tag = await softDeleteTag(id, userId);
  
  await prisma.tag.delete({
    where: { id }
  });

  return tag;
};
