import { DateFieldSchema, JsonFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { PostTypeEnum } from '../../admin/post/schema';
import { Static, Type } from '@sinclair/typebox';

export const PublicPostSchema = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.Union([Type.String(), Type.Null()]),
  publishedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  featureImages: Type.Array(Type.String()),
  content: Type.String(),
  metadata: JsonFieldSchema,
  postType: PostTypeEnum
});

export type PublicPost = Static<typeof PublicPostSchema>;

// --- Get list query ---
export const GetPublicPostsQuerySchema = Type.Intersect([
  ListQuerySchema,
  Type.Object({
    tags: Type.Optional(Type.Array(Type.String())),
    postType: Type.Optional(PostTypeEnum),
  })
]);
export type GetPublicPostsQuery = Static<typeof GetPublicPostsQuerySchema>;

export const GetPublicPostsResponseSchema = PaginatedResponseSchema(PublicPostSchema);
export type GetPublicPostsResponse = Static<typeof GetPublicPostsResponseSchema>;

// --- Params ---
export const GetPublicPostParamsSchema = Type.Object({
  slug: Type.String(),
});

export type GetPublicPostParams = Static<typeof GetPublicPostParamsSchema>;
