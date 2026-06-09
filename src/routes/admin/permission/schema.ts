import { Type, Static } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '@/core/schema';

// --- Model ---
export const PermissionSchema = Type.Object({
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
export type Permission = Static<typeof PermissionSchema>;


// --- List ---
export const GetPermissionsQuerySchema = Type.Omit(ListQuerySchema, ['isActive']);
export type GetPermissionsQuery = Static<typeof GetPermissionsQuerySchema>;

export const GetPermissionsResponseSchema = PaginatedResponseSchema(PermissionSchema);
export type GetPermissionsResponse = Static<typeof GetPermissionsResponseSchema>;


// --- Get ---
export const GetPermissionParamsSchema = GetByIdParamsSchema;
export type GetPermissionParams = Static<typeof GetPermissionParamsSchema>;

// --- Create ---
export const CreatePermissionBodySchema = Type.Object({
  name: Type.String(),
  description: Type.Union([Type.String(), Type.Null()])
});
export type CreatePermissionBody = Static<typeof CreatePermissionBodySchema>;

// --- Update ---
export const UpdatePermissionBodySchema = Type.Partial(CreatePermissionBodySchema);
export type UpdatePermissionBody = Static<typeof UpdatePermissionBodySchema>;

// --- Delete ---
export const DeletePermissionBodySchema = DeleteItemBodySchema;
export type DeletePermissionBody = Static<typeof DeletePermissionBodySchema>;

