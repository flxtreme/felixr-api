import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const TrainingSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  provider: Type.String(),
  completedAt: Type.String(),
  description: Type.String(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Training = Static<typeof TrainingSchema>;

export const GetTrainingsQuerySchema = ListQuerySchema;
export type GetTrainingsQuery = Static<typeof GetTrainingsQuerySchema>;
export const GetTrainingsResponseSchema = PaginatedResponseSchema(TrainingSchema);
export type GetTrainingsResponse = Static<typeof GetTrainingsResponseSchema>;
export const GetTrainingParamsSchema = GetByIdParamsSchema;
export type GetTrainingParams = Static<typeof GetTrainingParamsSchema>;

export const CreateTrainingBodySchema = Type.Object({
  title: Type.String(),
  provider: Type.String(),
  completedAt: Type.String(),
  description: Type.String(),
});
export type CreateTrainingBody = Static<typeof CreateTrainingBodySchema>;
export const UpdateTrainingBodySchema = Type.Partial(CreateTrainingBodySchema);
export type UpdateTrainingBody = Static<typeof UpdateTrainingBodySchema>;
export const DeleteTrainingBodySchema = DeleteItemBodySchema;
export type DeleteTrainingBody = Static<typeof DeleteTrainingBodySchema>;
