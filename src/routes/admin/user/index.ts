import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const userModule = async (app: FastifyInstance) => {
  app.get('/', {
    schema: {
      tags: ['user'],
      querystring: schema.GetUsersQuerySchema,
      response: { 200: schema.GetUsersResponseSchema },
    },
  }, handler.getUsers);

  app.get('/:id', {
    schema: {
      tags: ['user'],
      params: schema.GetUserParamsSchema,
    },
  }, handler.getUser);

  app.post('/', {
    schema: {
      tags: ['user'],
      body: schema.CreateUserBodySchema,
    },
  }, handler.createUser);

  app.put('/:id', {
    schema: {
      tags: ['user'],
      params: schema.GetUserParamsSchema,
      body: schema.UpdateUserBodySchema,
    },
  }, handler.updateUser);

  app.delete('/:id', {
    schema: {
      tags: ['user'],
      params: schema.GetUserParamsSchema,
      body: schema.DeleteUserBodySchema,
    },
  }, handler.deleteUser);
};

export default userModule;
