import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const PublicGigSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  details: Type.Array(Type.String()),
  link: Type.String(),
  linkLabel: Type.String(),
  external: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicGig = Static<typeof PublicGigSchema>;
export const GetPublicGigsQuerySchema = ListQuerySchema;
export type GetPublicGigsQuery = Static<typeof GetPublicGigsQuerySchema>;
export const GetPublicGigsResponseSchema = PaginatedResponseSchema(PublicGigSchema);
export type GetPublicGigsResponse = Static<typeof GetPublicGigsResponseSchema>;
export const GetPublicGigParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicGigParams = Static<typeof GetPublicGigParamsSchema>;
