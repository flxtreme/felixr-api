import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';
import { GetPublicPostsQuerySchema } from '../post/schema';

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
      querystring: GetPublicPostsQuerySchema,
    },
  }, handler.getPublicTag);
}

export default publicTagModule;
