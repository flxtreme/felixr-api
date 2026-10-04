import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const productModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'product'], querystring: schema.GetProductsQuerySchema, response: { 200: schema.GetProductsResponseSchema } } }, handler.getProducts);
  app.get('/:id', { schema: { tags: ['admin', 'product'], params: schema.GetProductParamsSchema, response: { 200: schema.ProductSchema } } }, handler.getProduct);
  app.post('/', { schema: { tags: ['admin', 'product'], body: schema.CreateProductBodySchema, response: { 201: schema.ProductSchema } } }, handler.createProduct);
  app.put('/:id', { schema: { tags: ['admin', 'product'], params: schema.GetProductParamsSchema, body: schema.UpdateProductBodySchema, response: { 200: schema.ProductSchema } } }, handler.updateProduct);
  app.delete('/:id', { schema: { tags: ['admin', 'product'], params: schema.GetProductParamsSchema, body: schema.DeleteProductBodySchema, response: { 200: schema.ProductSchema } } }, handler.deleteProduct);
};

export default productModule;
