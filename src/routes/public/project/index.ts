import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicProjectModule = async (app: FastifyInstance) => {

  app.get('/', {
    schema: {
      tags: ['public', 'project'],
      querystring: schema.GetPublicProjectsQuerySchema,
      response: {
        200: schema.GetPublicProjectsResponseSchema,
      },
    },
  }, handler.getProjects);

  app.get('/:slug', {
    schema: {
      tags: ['public', 'project'],
      params: schema.GetPublicProjectParamsSchema,
      response: {
        200: schema.PublicProjectSchema,
      },
    },
  }, handler.getProject);

}

export default publicProjectModule;
