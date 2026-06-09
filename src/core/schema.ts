import { Prisma } from '@prisma/client';
import { Static, TSchema, Type } from '@sinclair/typebox';

export const ErrorSchema = Type.Object({
  message: Type.String(),
});

export type ErrorType = Static<typeof ErrorSchema>;

export const MetaSchema = Type.Object({
  total: Type.Number(),
  offset: Type.Number(),
  limit: Type.Number(),
  page: Type.Number(),
});

export type MetaType = Static<typeof MetaSchema>;

export const UserRequestSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  username: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  roles: Type.Array(Type.String()),
});

export type UserRequestType = Static<typeof UserRequestSchema>;

export const PaginatedResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    data: Type.Array(dataSchema),
    meta: MetaSchema,
  });


export type PaginatedResponseType<T extends TSchema> = Static<ReturnType<typeof PaginatedResponseSchema<T>>>;

export const ListQuerySchema = Type.Object({
  page: Type.Optional(Type.Number()),
  limit: Type.Optional(Type.Number()),  
  offset: Type.Optional(Type.Number()),
  search: Type.Optional(Type.String()),
  isActive: Type.Optional(Type.Boolean()),
});

export type ListQueryType = Static<typeof ListQuerySchema>;

export const DateFieldSchema = Type.Unsafe<Date>({ type: 'string', format: 'date-time' });
export const JsonFieldSchema = Type.Union([Type.Unsafe<Prisma.JsonValue>(Type.Any()), Type.Null()]);

export const GetByIdParamsSchema = Type.Object({
  id: Type.String(),
});

export type GetByIdParamsType = Static<typeof GetByIdParamsSchema>;

export const DeleteItemBodySchema = Type.Object({
  isPermanent: Type.Boolean({ default: false }),
});

export type DeleteItemBodyType = Static<typeof DeleteItemBodySchema>;


