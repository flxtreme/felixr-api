import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicTagModule = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      tags: ['tag', 'public'],
      querystring: schema.GetPublicTagsQuerySchema,
      response: { 200: schema.GetPublicTagsResponseSchema },
    },
  }, handler.getPublicTags);

  app.get('/:slug', {
    schema: {
      tags: ['tag', 'public'],
      params: schema.GetPublicTagParamsSchema,
    },
  }, handler.getPublicTag);
}

export default publicTagModule;