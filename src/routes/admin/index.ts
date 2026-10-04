import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import postModule from './post';
import permissionModule from './permission';
import tagModule from './tag';
import userModule from './user';
import roleModule from './role';
import projectModule from './project';
import experienceModule from './experience';
import productModule from './product';
import gigModule from './gig';
import stackModule from './stack';
import certificationModule from './certification';
import trainingModule from './training';

const adminModule = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.register(userModule, { prefix: '/user' });
  app.register(roleModule, { prefix: '/role' });
  app.register(permissionModule, { prefix: '/permission' });

  app.register(postModule, { prefix: '/post' });
  app.register(projectModule, { prefix: '/project' });
  app.register(experienceModule, { prefix: '/experience' });
  app.register(productModule, { prefix: '/product' });
  app.register(gigModule, { prefix: '/gig' });
  app.register(stackModule, { prefix: '/stack' });
  app.register(certificationModule, { prefix: '/certification' });
  app.register(trainingModule, { prefix: '/training' });
  app.register(tagModule, { prefix: '/tag' });
};

export default adminModule;
