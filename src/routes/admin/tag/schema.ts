import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { Type, Static } from '@sinclair/typebox';
import { Tag as TagPrisma, Prisma } from '@prisma/client';
 
// --- Model ---
export const TagSchema = Type.Object({
  id: Type.String(),
  slug: Type.String(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  name: Type.String(),
  excludeFromPages: Type.Boolean(),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
  count: Type.Optional(Type.Number()),
});
export type Tag = Static<typeof TagSchema>;

// --- Get list query ---
export const GetTagsQuerySchema = ListQuerySchema;
export type GetTagsQuery = Static<typeof GetTagsQuerySchema>;

export const GetTagsResponseSchema = PaginatedResponseSchema(TagSchema);
export type GetTagsResponse = Static<typeof GetTagsResponseSchema>;

// --- Params ---
export const GetTagParamsSchema = GetByIdParamsSchema;
export type GetTagParams = Static<typeof GetTagParamsSchema>;

// --- Create ---
export const CreateTagBodySchema = Type.Object({
  slug: Type.String(),
  name: Type.String(),
  excludeFromPages: Type.Boolean()
});

export type CreateTagBody = Static<typeof CreateTagBodySchema>;

// --- Update ---
export const UpdateTagBodySchema = Type.Partial(CreateTagBodySchema);
export type UpdateTagBody = Static<typeof UpdateTagBodySchema>;

// --- Delete ---
export const DeleteTagBodySchema = DeleteItemBodySchema;
export type DeleteTagBody = Static<typeof DeleteTagBodySchema>;
