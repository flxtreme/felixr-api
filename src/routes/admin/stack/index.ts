import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const stackModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'stack'], querystring: schema.GetStacksQuerySchema, response: { 200: schema.GetStacksResponseSchema } } }, handler.getStacks);
  app.get('/:id', { schema: { tags: ['admin', 'stack'], params: schema.GetStackParamsSchema, response: { 200: schema.StackSchema } } }, handler.getStack);
  app.post('/', { schema: { tags: ['admin', 'stack'], body: schema.CreateStackBodySchema, response: { 201: schema.StackSchema } } }, handler.createStack);
  app.put('/:id', { schema: { tags: ['admin', 'stack'], params: schema.GetStackParamsSchema, body: schema.UpdateStackBodySchema, response: { 200: schema.StackSchema } } }, handler.updateStack);
  app.delete('/:id', { schema: { tags: ['admin', 'stack'], params: schema.GetStackParamsSchema, body: schema.DeleteStackBodySchema, response: { 200: schema.StackSchema } } }, handler.deleteStack);
};

export default stackModule;
