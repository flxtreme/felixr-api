import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const PublicStackSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  key: Type.String(),
  color: Type.String(),
  category: Type.String(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicStack = Static<typeof PublicStackSchema>;
export const GetPublicStacksQuerySchema = ListQuerySchema;
export type GetPublicStacksQuery = Static<typeof GetPublicStacksQuerySchema>;
export const GetPublicStacksResponseSchema = PaginatedResponseSchema(PublicStackSchema);
export type GetPublicStacksResponse = Static<typeof GetPublicStacksResponseSchema>;
export const GetPublicStackParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicStackParams = Static<typeof GetPublicStackParamsSchema>;
