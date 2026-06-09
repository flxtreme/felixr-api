import { resolveMeta } from '@/utils';
import {
  GetPublicTagsQuery,
  GetPublicTagsResponse,
  PublicTag,
  PublicTagPosts,
} from './schema';
import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '@/core/prisma';
import { GetPublicPostsQuery } from '../post/schema';
import * as publicPostService from '../post/service';

const SELECT_TAG = {
  name: true,
  slug: true,
  _count: {
    select: {
      posts: true
    }
  }
}

export const getPublicTags = async (query: GetPublicTagsQuery): Promise<GetPublicTagsResponse> => {
  const { offset, limit, search, isActive } = query;

  const where: Prisma.TagWhereInput= {};

  if ( !isEmpty(search) ) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { id: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  if ( isBoolean(isActive) && isActive === true ) {
    where.isDeleted = false;
  } else if ( isBoolean(isActive) && isActive === false ) {
    where.OR = [
      { isDeleted: true }
    ];
  }

  const [
    tags,
    total
  ] = await Promise.all([
    prisma.tag.findMany({
      select: SELECT_TAG,
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.tag.count({ where })
  ]);
  
  return {
    data: tags.map((tag) => {
      return {
        name: tag.name,
        slug: tag.slug,
        count: tag._count.posts
      }
    }),
    meta: resolveMeta(total, offset, limit),
  };
};

export const getPublicTag = async (slug: string, query: GetPublicPostsQuery): Promise<PublicTagPosts | null> => {
  const tag = await prisma.tag.findUnique({
    select: SELECT_TAG,
    where: { slug, isDeleted: false },
  });

  if (!tag) return null;

  const posts = await publicPostService.getPosts({
    ...query,
    tags: [slug]
  });

  return {
    name: tag.name,
    slug: tag.slug,
    count: tag?._count.posts ?? 0,
    posts
  };
};
