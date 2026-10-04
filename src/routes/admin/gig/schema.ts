import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const GigSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  details: Type.Array(Type.String()),
  link: Type.String(),
  linkLabel: Type.String(),
  external: Type.Boolean(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Gig = Static<typeof GigSchema>;

export const GetGigsQuerySchema = ListQuerySchema;
export type GetGigsQuery = Static<typeof GetGigsQuerySchema>;
export const GetGigsResponseSchema = PaginatedResponseSchema(GigSchema);
export type GetGigsResponse = Static<typeof GetGigsResponseSchema>;
export const GetGigParamsSchema = GetByIdParamsSchema;
export type GetGigParams = Static<typeof GetGigParamsSchema>;

export const CreateGigBodySchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  details: Type.Array(Type.String(), { default: [] }),
  link: Type.String(),
  linkLabel: Type.String(),
  external: Type.Boolean({ default: false }),
});
export type CreateGigBody = Static<typeof CreateGigBodySchema>;
export const UpdateGigBodySchema = Type.Partial(CreateGigBodySchema);
export type UpdateGigBody = Static<typeof UpdateGigBodySchema>;
export const DeleteGigBodySchema = DeleteItemBodySchema;
export type DeleteGigBody = Static<typeof DeleteGigBodySchema>;
