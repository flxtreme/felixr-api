import { DateFieldSchema, JsonFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '@/core/schema';
import { PostType, PostStatus } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const PostStatusEnum = Type.Unsafe<PostStatus>({
  type: 'string',
  enum: ['DRAFT', 'PUBLISHED', 'TRASHED'],
});
export type PostStatusEnum = PostStatus;

export const PostTypeEnum = Type.Unsafe<PostType>({
  type: 'string',
  enum: ['POST', 'PAGE'],
});
export type PostTypeEnum = PostType;

export const PostSchema = Type.Object({
  id: Type.String(),
  slug: Type.String(),
  content: Type.String(),
  status: PostStatusEnum,
  publishedAt: Type.Union([DateFieldSchema, Type.Null()]),
  featureImages: Type.Array(Type.String()),
  userId: Type.String(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  metadata: JsonFieldSchema,
  postType: PostTypeEnum,
  excerpt: Type.Union([Type.String(), Type.Null()]),
  title: Type.String(),
});

export type GetPostResponse = Static<typeof PostSchema>;

// --- Get list query ---
export const GetPostsQuerySchema = Type.Intersect([
  ListQuerySchema,
  Type.Object({
    tags: Type.Optional(Type.Array(Type.String())),
    postType: Type.Optional(PostTypeEnum),
    status: Type.Optional(PostStatusEnum),
  })
]);
export type GetPostsQuery = Static<typeof GetPostsQuerySchema>;

export const GetPostsResponseSchema = PaginatedResponseSchema(PostSchema);
export type GetPostsResponse = Static<typeof GetPostsResponseSchema>;

export const CreatePostBodySchema = Type.Object({
  slug: Type.String(),
  content: Type.String(),
  status: PostStatusEnum,
  publishedAt: Type.Union([DateFieldSchema, Type.Null()], { default: null }),
  featureImages: Type.Array(Type.String(), { default: [] }),
  metadata: JsonFieldSchema,
  postType: PostTypeEnum,
  excerpt: Type.Union([Type.String(), Type.Null()], { default: null }),
  title: Type.String(),
});

export type CreatePostBody = Static<typeof CreatePostBodySchema>;

export const UpdatePostBodySchema = Type.Partial(CreatePostBodySchema);

export type UpdatePostBody = Static<typeof UpdatePostBodySchema>;

export const DeletePostBodySchema = Type.Object({
  isPermanent: Type.Boolean({ default: false }),
});

export type DeletePostBody = Static<typeof DeletePostBodySchema>;

export const DeletePostResponseSchema = Type.Object({
  message: Type.String(),
});

export type DeletePostResponse = Static<typeof DeletePostResponseSchema>;
