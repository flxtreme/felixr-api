import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicGigModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'gig'], querystring: schema.GetPublicGigsQuerySchema, response: { 200: schema.GetPublicGigsResponseSchema } } }, handler.getGigs);
  app.get('/:id', { schema: { tags: ['public', 'gig'], params: schema.GetPublicGigParamsSchema, response: { 200: schema.PublicGigSchema } } }, handler.getGig);
};

export default publicGigModule;
