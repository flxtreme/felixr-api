import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import {
  GetPublicPostsQuery,
  GetPublicPostsResponse,
  PublicPost,
} from './schema';
import { BUCKETS, downloadText } from '../../../core/storage';

const PUBLIC_POST_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  featureImages: true,
  postType: true,
}

const contentPath = (id: string) => `posts/${id}/content.md`;
const metadataPath = (id: string) => `posts/${id}/metadata.json`;

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
    prisma.post.findMany({ select: PUBLIC_POST_SELECT, where, take: limit, skip: offset }),
    prisma.post.count({ where })
  ]);

  return {
    data: posts,
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
    where: { 
      slug, 
      postType: 'PAGE', 
      isDeleted: false,
    },
    select: PUBLIC_POST_SELECT
  });

  return page;
}

export const getPostContent = async (slug: string): Promise<string | null> => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, isDeleted: false },
      select: { id: true },
    });

    if (!post) return null;

    return await downloadText(BUCKETS.CONTENT, contentPath(post.id));
  } catch {
    return null;
  }
};

export const getPostMetadata = async (slug: string): Promise<Record<string, unknown> | null> => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, isDeleted: false },
      select: { id: true },
    });

    if (!post) return null;

    const raw = await downloadText(BUCKETS.CONTENT, metadataPath(post.id));
    return JSON.parse(raw);
  } catch {
    return null;
  }
};