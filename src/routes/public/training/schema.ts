import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const PublicTrainingSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  provider: Type.String(),
  completedAt: Type.String(),
  description: Type.String(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicTraining = Static<typeof PublicTrainingSchema>;
export const GetPublicTrainingsQuerySchema = ListQuerySchema;
export type GetPublicTrainingsQuery = Static<typeof GetPublicTrainingsQuerySchema>;
export const GetPublicTrainingsResponseSchema = PaginatedResponseSchema(PublicTrainingSchema);
export type GetPublicTrainingsResponse = Static<typeof GetPublicTrainingsResponseSchema>;
export const GetPublicTrainingParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicTrainingParams = Static<typeof GetPublicTrainingParamsSchema>;
