import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import publicPostModule from './post';
import publicTagModule from './tag';

const publicModule = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.addHook('onRoute', (routeOptions) => {
    routeOptions.schema = routeOptions.schema ?? {};
    routeOptions.schema.security = [];
    routeOptions.config = { ...routeOptions.config, public: true };
  });

  app.register(publicPostModule, { prefix: '/post' });
  app.register(publicTagModule, { prefix: '/tag' })
};

export default publicModule;