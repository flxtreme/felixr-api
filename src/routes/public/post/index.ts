import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicPostModule = async (app: FastifyInstance) => {

  app.get('/', {
    schema: {
      tags: ['blog', 'public'],
      querystring: schema.GetPublicPostsQuerySchema,
      response: {
        200: schema.GetPublicPostsResponseSchema,
      },
    },
  }, handler.getPosts);

  app.get('/:slug', {
    schema: {
      tags: ['blog', 'public'],
      params: schema.GetPublicPostParamsSchema,
      response: {
        200: schema.PublicPostSchema,
      },
    },
  }, handler.getPost);

  app.get('/page/:slug', {
    schema: {
      tags: ['blog', 'public'],
      params: schema.GetPublicPostParamsSchema,
      response: {
        200: schema.PublicPostSchema,
      },
    },
  }, handler.getPage);

    app.get('/:slug/content', {
      schema: {
        tags: ['', 'post'],
        params: schema.GetPublicPostParamsSchema,
      },
    }, handler.getPostContent);
  
    app.get('/:slug/metadata', {
      schema: {
        tags: ['public', 'post'],
        params: schema.GetPublicPostParamsSchema,
      },
    }, handler.getPostMetadata);
}

export default publicPostModule;
