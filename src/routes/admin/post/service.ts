import { Prisma } from '@prisma/client';
import { isBoolean, isEmpty } from 'lodash';
import { prisma } from '../../../core/prisma';
import { resolveMeta } from '../../../utils';
import * as helpers from './helpers';
import { BUCKETS, uploadFile, downloadText } from '../../../core/storage';
import { CreatePostBody, GetPostResponse, GetPostsQuery, GetPostsResponse, UpdatePostBody } from './schema';

const contentPath = (id: string) => `posts/${id}/content.md`;
const metadataPath = (id: string) => `posts/${id}/metadata.json`;

export const getPosts = async (query: GetPostsQuery): Promise<GetPostsResponse> => {
  const { offset, limit, search, isActive, postType = 'PAGE', status } = query;

  const where: Prisma.PostWhereInput = { postType };

  if (status === 'DRAFT' || status === 'TRASHED') {
    where.status = status;
    where.isDeleted = status === 'TRASHED';
  } else if (isBoolean(isActive) && isActive === true) {
    where.isDeleted = false;
    where.status = 'PUBLISHED';
  } else if (isBoolean(isActive) && isActive === false) {
    where.AND = [{ OR: [{ isDeleted: true }, { status: 'DRAFT' }, { status: 'TRASHED' }] }];
  } else {
    where.isDeleted = false;
    where.status = !isEmpty(status) ? status : { in: ['DRAFT', 'PUBLISHED'] };
  }

  if (!isEmpty(search)) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        postType: true,
        isDeleted: true,
        featureImages: true,
        userId: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        createdBy: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: posts,
    meta: resolveMeta(total, offset, limit),
  };
};

export const getPost = async (id: string): Promise<GetPostResponse | null> => {
  return prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      status: true,
      postType: true,
      isDeleted: true,
      featureImages: true,
      userId: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      createdBy: true,
    },
  });
};

export const getPostContent = async (id: string): Promise<string | null> => {
  try {
    return await downloadText(BUCKETS.CONTENT, contentPath(id));
  } catch {
    return null;
  }
};

export const getPostMetadata = async (id: string): Promise<Record<string, unknown> | null> => {
  try {
    const raw = await downloadText(BUCKETS.CONTENT, metadataPath(id));
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const createPost = async (body: CreatePostBody, userId: string): Promise<GetPostResponse> => {
  const { metadata, content, ...rest } = body;
  const tags = (metadata as { tags?: string[] })?.tags ?? [];
  const publishedAt = rest.status === 'PUBLISHED' ? new Date() : null;

  const post = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        ...rest,
        content: '',
        status: rest.status ?? 'DRAFT',
        createdBy: userId,
        publishedAt,
        user: { connect: { id: userId } },
      },
    });

    await helpers.syncPostTags(tx, post.id, userId, tags);

    return post;
  });

  const [contentUrl] = await Promise.all([
    uploadFile(BUCKETS.CONTENT, contentPath(post.id), content, 'text/markdown'),
    metadata
      ? uploadFile(BUCKETS.CONTENT, metadataPath(post.id), JSON.stringify(metadata, null, 2), 'application/json')
      : Promise.resolve(),
  ]);

  return prisma.post.update({
    where: { id: post.id },
    data: { content: contentUrl },
  });
};

export const updatePost = async (id: string, body: UpdatePostBody, userId: string): Promise<GetPostResponse> => {
  const { metadata, content, ...rest } = body;
  const tags = (metadata as { tags?: string[] })?.tags;

  const currPost = await getPost(id);

  if (!currPost) {
    throw new Error('Post not found');
  }

  const publishedAt =
    currPost.status !== 'PUBLISHED'
      ? rest.status === 'PUBLISHED'
        ? new Date()
        : currPost.publishedAt
      : currPost.publishedAt;

  const post = await prisma.$transaction(async (tx) => {
    const post = await tx.post.update({
      where: { id },
      data: {
        ...rest,
        publishedAt,
        updatedBy: userId,
        updatedAt: new Date(),
        userId,
      },
    });

    await helpers.syncPostTags(tx, post.id, userId, tags ?? []);

    return post;
  });

  await Promise.all([
    content
      ? uploadFile(BUCKETS.CONTENT, contentPath(id), content, 'text/markdown')
      : Promise.resolve(),
    metadata
      ? uploadFile(BUCKETS.CONTENT, metadataPath(id), JSON.stringify(metadata, null, 2), 'application/json')
      : Promise.resolve(),
  ]);

  if (content) {
    return prisma.post.update({
      where: { id },
      data: { content: contentPath(id) },
    });
  }

  return post;
};

export const softDeletePost = async (id: string, userId: string): Promise<GetPostResponse> => {
  return prisma.post.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
      status: 'TRASHED',
    },
  });
};

export const deletePost = async (id: string, userId: string): Promise<void> => {
  await softDeletePost(id, userId);

  await prisma.post.delete({
    where: { id },
  });
};