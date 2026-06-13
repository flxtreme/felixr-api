import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';
import { GetByIdParamsSchema, ListQuerySchema } from '../../../core/schema';

const postModule = async (app: FastifyInstance) => {
    
  app.get('/', {
    schema: {
      tags: ['admin', 'post'],
      querystring: ListQuerySchema,
      response: {
        200: schema.GetPostsResponseSchema,
      },
    },
  }, handler.getPostsHandler);

  app.get('/:id', {
    schema: {
      tags: ['admin', 'post'],
      params: GetByIdParamsSchema,
      response: {
        200: schema.PostSchema,
      },
    },
  }, handler.getPost);

  app.get('/:id/content', {
    schema: {
      tags: ['admin', 'post'],
      params: GetByIdParamsSchema,
    },
  }, handler.getPostContent);

  app.get('/:id/metadata', {
    schema: {
      tags: ['admin', 'post'],
      params: GetByIdParamsSchema,
    },
  }, handler.getPostMetadata);

  app.post('/', {
    schema: {
      tags: ['admin', 'post'],
      body: schema.CreatePostBodySchema,
      response: {
        200: schema.PostSchema,
      },
    },
  }, handler.createPost);

  app.put('/:id', {
    schema: {
      tags: ['admin', 'post'],
      params: GetByIdParamsSchema,
      body: schema.UpdatePostBodySchema,
      response: {
        200: schema.PostSchema,
      },
    },
  }, handler.updatePost);


  app.delete('/:id', {
    schema: {
      tags: ['admin', 'post'],
      params: GetByIdParamsSchema,
      response: {
        200: schema.PostSchema
      },
    },
  }, handler.deletePost);
}

export default postModule;
