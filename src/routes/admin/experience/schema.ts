import { Type, Static } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const ExperienceSchema = Type.Object({
  id: Type.String(),
  role: Type.String(),
  company: Type.String(),
  start: Type.String(),
  end: Type.String(),
  responsibilities: Type.Array(Type.String()),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Experience = Static<typeof ExperienceSchema>;

export const GetExperiencesQuerySchema = ListQuerySchema;
export type GetExperiencesQuery = Static<typeof GetExperiencesQuerySchema>;
export const GetExperiencesResponseSchema = PaginatedResponseSchema(ExperienceSchema);
export type GetExperiencesResponse = Static<typeof GetExperiencesResponseSchema>;
export const GetExperienceParamsSchema = GetByIdParamsSchema;
export type GetExperienceParams = Static<typeof GetExperienceParamsSchema>;

export const CreateExperienceBodySchema = Type.Object({
  role: Type.String(),
  company: Type.String(),
  start: Type.String(),
  end: Type.String(),
  responsibilities: Type.Array(Type.String(), { default: [] }),
});
export type CreateExperienceBody = Static<typeof CreateExperienceBodySchema>;
export const UpdateExperienceBodySchema = Type.Partial(CreateExperienceBodySchema);
export type UpdateExperienceBody = Static<typeof UpdateExperienceBodySchema>;
export const DeleteExperienceBodySchema = DeleteItemBodySchema;
export type DeleteExperienceBody = Static<typeof DeleteExperienceBodySchema>;
