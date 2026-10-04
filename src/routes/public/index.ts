import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import publicPostModule from './post';
import publicTagModule from './tag';
import publicProjectModule from './project';
import publicExperienceModule from './experience';
import publicProductModule from './product';
import publicGigModule from './gig';
import publicStackModule from './stack';
import publicCertificationModule from './certification';
import publicTrainingModule from './training';

const publicModule = async (fastify: FastifyInstance) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.addHook('onRoute', (routeOptions) => {
    routeOptions.schema = routeOptions.schema ?? {};
    routeOptions.schema.security = [];
    routeOptions.config = { ...routeOptions.config, public: true };
  });

  app.register(publicPostModule, { prefix: '/post' });
  app.register(publicTagModule, { prefix: '/tag' });
  app.register(publicProjectModule, { prefix: '/project' });
  app.register(publicExperienceModule, { prefix: '/experience' });
  app.register(publicProductModule, { prefix: '/product' });
  app.register(publicGigModule, { prefix: '/gig' });
  app.register(publicStackModule, { prefix: '/stack' });
  app.register(publicCertificationModule, { prefix: '/certification' });
  app.register(publicTrainingModule, { prefix: '/training' });
};

export default publicModule;
