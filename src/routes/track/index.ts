import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const trackModule = async (app: FastifyInstance) => {
  app.post('/', {
    config: { public: true },
    schema: {
      tags: ['track'],
      body: schema.TrackBodySchema,
      response: {
        200: schema.TrackResponseSchema,
      },
    },
  }, handler.handleTrack);
};

export default trackModule;
