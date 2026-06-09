import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import * as handler from './handler';
import * as schema from './schema';

export const authModule = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.post('/login', {
    config: { public: true },
    schema: {
      tags: ['auth'],
      body: schema.LoginSchema,
      response: {
        200: schema.LoginResponseSchema,
      },
    },
  }, handler.login);

  app.post('/register', {
    config: { public: true },
    schema: {
      tags: ['auth'],
      body: schema.RegisterChema,
      response: {
        200: schema.LoginResponseSchema,
      },
    },
  }, handler.register);
};
