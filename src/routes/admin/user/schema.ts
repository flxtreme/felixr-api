import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '@/core/schema';
import { Type, Static } from '@sinclair/typebox';


// --- Model ---
export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  username: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  phone: Type.Union([Type.String(), Type.Null()]),
  avatar: Type.Union([Type.String(), Type.Null()]),
  picture: Type.Union([Type.String(), Type.Null()]),
  emailVerified: Type.Boolean(),
  emailVerifiedAt: Type.Union([DateFieldSchema, Type.Null()]),
  phoneVerified: Type.Boolean(),
  phoneVerifiedAt: Type.Union([DateFieldSchema, Type.Null()]),
  isActive: Type.Boolean(),
  isDeleted: Type.Boolean(),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  createdBy: Type.Union([Type.String(), Type.Null()]),
  
  permissions: Type.Array(Type.String()),
  roles: Type.Array(Type.String()),
});
export type User = Static<typeof UserSchema>;

// --- Get list query ---
export const GetUsersQuerySchema = ListQuerySchema;
export type GetUsersQuery = Static<typeof GetUsersQuerySchema>;

export const GetUsersResponseSchema = PaginatedResponseSchema(UserSchema);
export type GetUsersResponse = Static<typeof GetUsersResponseSchema>;

// --- Params ---
export const GetUserParamsSchema = GetByIdParamsSchema;
export type GetUserParams = Static<typeof GetUserParamsSchema>;

// --- Create ---
export const CreateUserBodySchema = Type.Object({
  email: Type.String(),
  username: Type.String(),
  password: Type.String(),
  name: Type.Optional(Type.String()),
  phone: Type.Optional(Type.String()),
  avatar: Type.Optional(Type.String()),
  roles: Type.Optional(Type.Array(Type.String()))
});
export type CreateUserBody = Static<typeof CreateUserBodySchema>;

// --- Update ---
export const UpdateUserBodySchema = Type.Partial(CreateUserBodySchema);
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;

// --- Delete ---
export const DeleteUserBodySchema = DeleteItemBodySchema;
export type DeleteUserBody = Static<typeof DeleteUserBodySchema>;
