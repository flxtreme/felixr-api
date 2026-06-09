import { GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '@/core/schema';
import { Static, Type } from '@sinclair/typebox';
import { GetPublicPostsResponseSchema } from '../post/schema';

// --- Model ---
export const PublicTagSchema = Type.Object({
  name: Type.String(),
  slug: Type.String(),
  count: Type.Number(),
});

export type PublicTag = Static<typeof PublicTagSchema>;

export const PublicTagPostsSchema = Type.Intersect([
  PublicTagSchema,
  Type.Object({
    posts: GetPublicPostsResponseSchema,
  }),
]);

export type PublicTagPosts = Static<typeof PublicTagPostsSchema>;

// --- Get list query ---
export const GetPublicTagsQuerySchema = ListQuerySchema;
export type GetPublicTagsQuery = Static<typeof GetPublicTagsQuerySchema>;

export const GetPublicTagsResponseSchema = PaginatedResponseSchema(PublicTagSchema);
export type GetPublicTagsResponse = Static<typeof GetPublicTagsResponseSchema>;

// --- Params ---
export const GetPublicTagParamsSchema = Type.Object({
  slug: Type.String()
});
export type GetPublicTagParams = Static<typeof GetPublicTagParamsSchema>;
