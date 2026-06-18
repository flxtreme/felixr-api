import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import postModule from './post';
import permissionModule from './permission';
import tagModule from './tag';
import userModule from './user';
import roleModule from './role';
import projectModule from './project';

const adminModule = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.register(userModule, { prefix: '/user' });
  app.register(roleModule, { prefix: '/role' });
  app.register(permissionModule, { prefix: '/permission' });

  app.register(postModule, { prefix: '/post' });
  app.register(projectModule, { prefix: '/project' });
  app.register(tagModule, { prefix: '/tag' });
};

export default adminModule;
