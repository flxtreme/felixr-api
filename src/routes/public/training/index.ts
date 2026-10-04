import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicTrainingModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'training'], querystring: schema.GetPublicTrainingsQuerySchema, response: { 200: schema.GetPublicTrainingsResponseSchema } } }, handler.getTrainings);
  app.get('/:id', { schema: { tags: ['public', 'training'], params: schema.GetPublicTrainingParamsSchema, response: { 200: schema.PublicTrainingSchema } } }, handler.getTraining);
};

export default publicTrainingModule;
