import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const tagModule = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      tags: ['tag', 'admin'],
      querystring: schema.GetTagsQuerySchema,
      response: { 200: schema.GetTagsResponseSchema },
    },
  }, handler.getTags);

  app.get('/:id', {
    schema: {
      tags: ['tag', 'admin'],
      params: schema.GetTagParamsSchema,
    },
  }, handler.getTag);

  app.post('/', {
    schema: {
      tags: ['tag', 'admin'],
      body: schema.CreateTagBodySchema,
    },
  }, handler.createTag);

  app.put('/:id', {
    schema: {
      tags: ['tag', 'admin'],
      params: schema.GetTagParamsSchema,
      body: schema.UpdateTagBodySchema,
    },
  }, handler.updateTag);

  app.delete('/:id', {
    schema: {
      tags: ['tag', 'admin'],
      params: schema.GetTagParamsSchema,
      body: schema.DeleteTagBodySchema,
    },
  }, handler.deleteTag);

  app.get('/search', {
    schema: {
      tags: ['tag', 'admin'],
      querystring: schema.SearchTagsQuerySchema,
    },
  }, handler.searchTags);
};

export default tagModule;
