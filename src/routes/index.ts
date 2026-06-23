import { FastifyInstance } from 'fastify';
import authPlugin from '../core/auth';
import adminModule from './admin';
import publicModule from './public';
import { authModule } from './auth';
import trackModule from './track';


export const routesPlugin = async (app: FastifyInstance) => {
  app.register(authModule, { prefix: '/auth' })
  app.register(publicModule, { prefix: '/public' });
  app.register(trackModule, { prefix: '/track' });
  // Register auth plugin first so the hook applies to all modules
  app.register(authPlugin);
  // Register all modules
  app.register(adminModule, { prefix: '/admin' });
};
