import { Static, Type } from '@sinclair/typebox';
import { DateFieldSchema, ListQuerySchema, PaginatedResponseSchema } from '../../../core/schema';
import { ProductActionTypeSchema } from '../../admin/product/schema';

export const PublicProductSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  price: Type.Number(),
  category: Type.String(),
  image: Type.String(),
  link: Type.String(),
  actionType: ProductActionTypeSchema,
  actionLabel: Type.String(),
  createdAt: DateFieldSchema,
  updatedAt: DateFieldSchema,
});
export type PublicProduct = Static<typeof PublicProductSchema>;
export const GetPublicProductsQuerySchema = ListQuerySchema;
export type GetPublicProductsQuery = Static<typeof GetPublicProductsQuerySchema>;
export const GetPublicProductsResponseSchema = PaginatedResponseSchema(PublicProductSchema);
export type GetPublicProductsResponse = Static<typeof GetPublicProductsResponseSchema>;
export const GetPublicProductParamsSchema = Type.Object({ id: Type.String() });
export type GetPublicProductParams = Static<typeof GetPublicProductParamsSchema>;
