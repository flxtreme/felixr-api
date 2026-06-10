import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import {
  GetPublicPostsQuery,
  GetPublicPostsResponse,
  PublicPost,
} from './schema';

const PUBLIC_POST_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  featureImages: true,
  content: true,
  metadata: true,
  postType: true,
}

export const getPosts = async (
    query: GetPublicPostsQuery
): Promise<GetPublicPostsResponse> => {  
  const { offset, limit, search, isActive, postType = 'PAGE', tags } = query;

  const where: Prisma.PostWhereInput = {
    postType,
    isDeleted: false,
  };

  if ( !isEmpty(search) ) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  if ( isBoolean(isActive) && isActive === true ) {
    where.isDeleted = false;
    where.status = 'PUBLISHED';
  } else if ( isBoolean(isActive) && isActive === false ) {
    where.OR = [
      { isDeleted: true },
      { status: 'DRAFT' },
      { status: 'TRASHED' },
    ];
  }

  if ( !isEmpty(tags) ) {
    where.tags = {
      some: {
        tag: {
          OR: [
            { slug: { in: tags, mode: 'insensitive'} },
            { name: { in: tags, mode: 'insensitive'} },
          ]
        },
      },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({ where, take: limit, skip: offset }),
    prisma.post.count({ where })
  ]);

  return {
    data: posts.map((post) => {
      return {
        ...post,
        content: ""
      }
    }),
    meta: resolveMeta(total, offset, limit)
  };
};


export const getPost = async (slug: string): Promise<PublicPost | null>=> {
  const post = await prisma.post.findUnique({
    where: { slug, postType: 'POST', isDeleted: false},
    select: PUBLIC_POST_SELECT
  });

  return post;
};

export const getPage = async ( slug: string ): Promise<PublicPost | null> => {
  const page = await prisma.post.findFirst({
    where: { slug, postType: 'PAGE', isDeleted: false},
    select: PUBLIC_POST_SELECT
  });

  return page;
}