import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';
import { GetByIdParamsSchema, ListQuerySchema } from '../../../core/schema';

const projectModule = async (app: FastifyInstance) => {

  app.get('/', {
    schema: {
      tags: ['admin', 'project'],
      querystring: ListQuerySchema,
      response: {
        200: schema.GetProjectsResponseSchema,
      },
    },
  }, handler.getProjectsHandler);

  app.get('/:id', {
    schema: {
      tags: ['admin', 'project'],
      params: GetByIdParamsSchema,
      response: {
        200: schema.ProjectSchema,
      },
    },
  }, handler.getProjectHandler);

  app.post('/', {
    schema: {
      tags: ['admin', 'project'],
      body: schema.CreateProjectBodySchema,
      response: {
        201: schema.ProjectSchema,
      },
    },
  }, handler.createProjectHandler);

  app.put('/:id', {
    schema: {
      tags: ['admin', 'project'],
      params: GetByIdParamsSchema,
      body: schema.UpdateProjectBodySchema,
      response: {
        200: schema.ProjectSchema,
      },
    },
  }, handler.updateProjectHandler);

  app.delete('/:id', {
    schema: {
      tags: ['admin', 'project'],
      params: GetByIdParamsSchema,
      body: schema.DeleteProjectBodySchema,
      response: {
        200: schema.ProjectSchema,
      },
    },
  }, handler.deleteProjectHandler);
};

export default projectModule;