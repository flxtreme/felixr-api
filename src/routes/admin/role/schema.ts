import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '@/core/schema';
import { Type, Static } from '@sinclair/typebox';

// --- Model ---
export const RoleSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema, 
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
  isDeleted: Type.Boolean(),
});
export type Role = Static<typeof RoleSchema>;

// --- List ---
export const GetRolesQuerySchema = ListQuerySchema;
export type GetRolesQuery = Static<typeof GetRolesQuerySchema>;

export const GetRolesResponseSchema = PaginatedResponseSchema(RoleSchema);
export type GetRolesResponse = Static<typeof GetRolesResponseSchema>;


// --- Get ---
export const GetRoleParamsSchema = GetByIdParamsSchema;
export type GetRoleParams = Static<typeof GetRoleParamsSchema>;

// --- Create ---
export const CreateRoleBodySchema = Type.Object({
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()])
});
export type CreateRoleBody = Static<typeof CreateRoleBodySchema>;

// --- Update ---
export const UpdateRoleBodySchema = Type.Partial(CreateRoleBodySchema);
export type UpdateRoleBody = Static<typeof UpdateRoleBodySchema>;

// --- Delete ---
export const DeleteRoleBodySchema = DeleteItemBodySchema;
export type DeleteRoleBody = Static<typeof DeleteRoleBodySchema>;
