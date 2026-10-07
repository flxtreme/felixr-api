import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, DeleteItemBodySchema, GetByIdParamsSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';

export const ProductActionTypeSchema = Type.Union([Type.Literal('redirect'), Type.Literal('download')]);

export const ProductSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  category: Type.String(),
  image: Type.String(),
  link: Type.String(),
  actionType: ProductActionTypeSchema,
  actionLabel: Type.String(),
  isPinned: Type.Boolean(),
  isDeleted: Type.Boolean(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
  deletedAt: Type.Union([DateFieldSchema, Type.Null()]),
  createdBy: Type.Union([Type.String(), Type.Null()]),
  updatedBy: Type.Union([Type.String(), Type.Null()]),
  deletedBy: Type.Union([Type.String(), Type.Null()]),
});
export type Product = Static<typeof ProductSchema>;

export const GetProductsQuerySchema = ListQuerySchema;
export type GetProductsQuery = Static<typeof GetProductsQuerySchema>;
export const GetProductsResponseSchema = PaginatedResponseSchema(ProductSchema);
export type GetProductsResponse = Static<typeof GetProductsResponseSchema>;
export const GetProductParamsSchema = GetByIdParamsSchema;
export type GetProductParams = Static<typeof GetProductParamsSchema>;

export const CreateProductBodySchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  price: Type.Number({ minimum: 0 }),
  category: Type.String(),
  image: Type.String(),
  link: Type.String(),
  actionType: ProductActionTypeSchema,
  actionLabel: Type.String(),
  isPinned: Type.Optional(Type.Boolean({ default: false })),
});
export type CreateProductBody = Static<typeof CreateProductBodySchema>;
export const UpdateProductBodySchema = Type.Partial(CreateProductBodySchema);
export type UpdateProductBody = Static<typeof UpdateProductBodySchema>;
export const DeleteProductBodySchema = DeleteItemBodySchema;
export type DeleteProductBody = Static<typeof DeleteProductBodySchema>;
