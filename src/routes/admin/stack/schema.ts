import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const StackSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  key: Type.String(),
  color: Type.String(),
  category: Type.String(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Stack = Static<typeof StackSchema>;

export const GetStacksQuerySchema = ListQuerySchema;
export type GetStacksQuery = Static<typeof GetStacksQuerySchema>;
export const GetStacksResponseSchema = PaginatedResponseSchema(StackSchema);
export type GetStacksResponse = Static<typeof GetStacksResponseSchema>;
export const GetStackParamsSchema = GetByIdParamsSchema;
export type GetStackParams = Static<typeof GetStackParamsSchema>;

export const CreateStackBodySchema = Type.Object({
  label: Type.String(),
  key: Type.String(),
  color: Type.String(),
  category: Type.String(),
});
export type CreateStackBody = Static<typeof CreateStackBodySchema>;
export const UpdateStackBodySchema = Type.Partial(CreateStackBodySchema);
export type UpdateStackBody = Static<typeof UpdateStackBodySchema>;
export const DeleteStackBodySchema = DeleteItemBodySchema;
export type DeleteStackBody = Static<typeof DeleteStackBodySchema>;
