import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicProductModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'product'], querystring: schema.GetPublicProductsQuerySchema, response: { 200: schema.GetPublicProductsResponseSchema } } }, handler.getProducts);
  app.get('/:id', { schema: { tags: ['public', 'product'], params: schema.GetPublicProductParamsSchema, response: { 200: schema.PublicProductSchema } } }, handler.getProduct);
};

export default publicProductModule;
