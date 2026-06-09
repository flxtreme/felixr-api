import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const roleModule = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      tags: ['role', 'admin'],
      querystring: schema.GetRolesQuerySchema,
      response: { 200: schema.GetRolesQuerySchema },
    },
  }, handler.getRoles);

  app.get('/:id', {
    schema: {
      tags: ['role', 'admin'],
      params: schema.GetRoleParamsSchema,
    },
  }, handler.getRole);

  app.post('/', {
    schema: {
      tags: ['role', 'admin'],
      body: schema.CreateRoleBodySchema,
    },
  }, handler.createRole);

  app.put('/:id', {
    schema: {
      tags: ['role', 'admin'],
      params: schema.GetRoleParamsSchema,
      body: schema.UpdateRoleBodySchema,
    },
  }, handler.updateRole);

  app.delete('/:id', {
    schema: {
      tags: ['role', 'admin'],
      params: schema.GetRoleParamsSchema,
      body: schema.DeleteRoleBodySchema,
    },
  }, handler.deleteRole);
};

export default roleModule;
