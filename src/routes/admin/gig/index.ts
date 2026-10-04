import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const gigModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'gig'], querystring: schema.GetGigsQuerySchema, response: { 200: schema.GetGigsResponseSchema } } }, handler.getGigs);
  app.get('/:id', { schema: { tags: ['admin', 'gig'], params: schema.GetGigParamsSchema, response: { 200: schema.GigSchema } } }, handler.getGig);
  app.post('/', { schema: { tags: ['admin', 'gig'], body: schema.CreateGigBodySchema, response: { 201: schema.GigSchema } } }, handler.createGig);
  app.put('/:id', { schema: { tags: ['admin', 'gig'], params: schema.GetGigParamsSchema, body: schema.UpdateGigBodySchema, response: { 200: schema.GigSchema } } }, handler.updateGig);
  app.delete('/:id', { schema: { tags: ['admin', 'gig'], params: schema.GetGigParamsSchema, body: schema.DeleteGigBodySchema, response: { 200: schema.GigSchema } } }, handler.deleteGig);
};

export default gigModule;
