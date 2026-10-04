import { Type, Static } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const PublicExperienceSchema = Type.Object({
  id: Type.String(),
  role: Type.String(),
  company: Type.String(),
  start: Type.String(),
  end: Type.String(),
  responsibilities: Type.Array(Type.String()),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicExperience = Static<typeof PublicExperienceSchema>;
export const GetPublicExperiencesQuerySchema = ListQuerySchema;
export type GetPublicExperiencesQuery = Static<typeof GetPublicExperiencesQuerySchema>;
export const GetPublicExperiencesResponseSchema = PaginatedResponseSchema(PublicExperienceSchema);
export type GetPublicExperiencesResponse = Static<typeof GetPublicExperiencesResponseSchema>;
export const GetPublicExperienceParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicExperienceParams = Static<typeof GetPublicExperienceParamsSchema>;
