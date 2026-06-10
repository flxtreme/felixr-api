import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import * as helpers from './helpers';
import { CreatePostBody, GetPostResponse, GetPostsQuery, GetPostsResponse, UpdatePostBody } from './schema';

export const getPosts = async (
    query: GetPostsQuery
): Promise<GetPostsResponse> => {  
  const { offset, limit, search, isActive, postType = 'PAGE', status } = query;

  const where: Prisma.PostWhereInput = {
    postType,
  };

  if (status === 'DRAFT' || status === 'TRASHED') {
    where.status = status;
    where.isDeleted = status === 'TRASHED';
  } else if (isBoolean(isActive) && isActive === true) {
    where.isDeleted = false;
    where.status = 'PUBLISHED';
  } else if (isBoolean(isActive) && isActive === false) {
    where.AND = [
      {
        OR: [
          { isDeleted: true },
          { status: 'DRAFT' },
          { status: 'TRASHED' },
        ]
      }
    ];
  } else {
    // no isActive — apply status filter or default to DRAFT + PUBLISHED
    where.isDeleted = false;
    where.status = !isEmpty(status) ? status : { in: ['DRAFT', 'PUBLISHED'] };
  }

  if (!isEmpty(search)) {
    const searchConditions = {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
        { excerpt: { contains: search, mode: 'insensitive' as const } },
      ]
    };

    // merge search into AND so it doesn't clobber other OR conditions
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      searchConditions,
    ];
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

export const getPost = async ( id: string ): Promise<GetPostResponse | null> => {
  const post = await prisma.post.findUnique({
    where: { id }
  });

  return post;
}

export const createPost = async (body: CreatePostBody, userId: string): Promise<GetPostResponse> => {
  const { metadata, ...rest } = body;
  const tags = (metadata as { tags?: string[] })?.tags ?? [];

  const publishedAt = rest.status === 'PUBLISHED' ? new Date() : null;

  const post = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        ...rest,
        metadata: metadata ?? Prisma.JsonNull,
        status: rest.status ?? 'DRAFT',
        createdBy: userId,
        publishedAt,
        user: { connect: { id: userId } },
      }
    });

    await helpers.syncPostTags(tx, post.id, userId, tags);

    return post;
  });

  return post;
};

export const updatePost = async (id: string, body: UpdatePostBody, userId: string): Promise<GetPostResponse> => {
  const { metadata, ...rest } = body;
  const tags = (metadata as { tags?: string[] })?.tags;

  const currPost = await getPost(id);

  if (!currPost) {
    throw new Error('Post not found');
  }

  const publishedAt = currPost.status !== 'PUBLISHED' 
    ? rest.status === 'PUBLISHED' ? new Date() : currPost.publishedAt
    : currPost.publishedAt;

  const post = await prisma.$transaction(async (tx) => {
    const post = await tx.post.update({
      where: { id },
      data: {
        ...rest,
        metadata: metadata ?? Prisma.JsonNull,
        publishedAt,
        updatedBy: userId,
        updatedAt: new Date(),
        userId: userId,
        // user: userId ? { connect: { id: userId } } : undefined,
      }
    });

    await helpers.syncPostTags(tx, post.id, userId, tags ?? []);

    return post;
  });

  return post;
};

export const softDeletePost = async (id: string, userId: string): Promise<GetPostResponse> => {
  const post = await prisma.post.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      status: 'TRASHED',
    }
  });

  return post;
};


export const deletePost = async (id: string, userId: string): Promise<void> => {
  await softDeletePost(id, userId);
  
  await prisma.post.delete({
    where: { id }
  });
};
