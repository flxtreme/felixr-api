import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const permissionModule = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      tags: ['permission', 'admin'],
      querystring: schema.GetPermissionsQuerySchema,
      response: { 200: schema.GetPermissionsQuerySchema },
    },
  }, handler.getPermissions);

  app.get('/:id', {
    schema: {
      tags: ['permission', 'admin'],
      params: schema.GetPermissionParamsSchema,
    },
  }, handler.getPermission);

  app.post('/', {
    schema: {
      tags: ['permission', 'admin'],
      body: schema.CreatePermissionBodySchema,
    },
  }, handler.createPermission);

  app.put('/:id', {
    schema: {
      tags: ['permission', 'admin'],
      params: schema.GetPermissionParamsSchema,
      body: schema.UpdatePermissionBodySchema,
    },
  }, handler.updatePermission);

  app.delete('/:id', {
    schema: {
      tags: ['permission', 'admin'],
      params: schema.GetPermissionParamsSchema,
      response: {
        200: schema.PermissionSchema
      }
    },
  }, handler.deletePermission);
};

export default permissionModule;
