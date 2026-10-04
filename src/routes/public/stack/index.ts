import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicStackModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'stack'], querystring: schema.GetPublicStacksQuerySchema, response: { 200: schema.GetPublicStacksResponseSchema } } }, handler.getStacks);
  app.get('/:id', { schema: { tags: ['public', 'stack'], params: schema.GetPublicStackParamsSchema, response: { 200: schema.PublicStackSchema } } }, handler.getStack);
};

export default publicStackModule;
