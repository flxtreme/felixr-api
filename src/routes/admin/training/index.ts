import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const trainingModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'training'], querystring: schema.GetTrainingsQuerySchema, response: { 200: schema.GetTrainingsResponseSchema } } }, handler.getTrainings);
  app.get('/:id', { schema: { tags: ['admin', 'training'], params: schema.GetTrainingParamsSchema, response: { 200: schema.TrainingSchema } } }, handler.getTraining);
  app.post('/', { schema: { tags: ['admin', 'training'], body: schema.CreateTrainingBodySchema, response: { 201: schema.TrainingSchema } } }, handler.createTraining);
  app.put('/:id', { schema: { tags: ['admin', 'training'], params: schema.GetTrainingParamsSchema, body: schema.UpdateTrainingBodySchema, response: { 200: schema.TrainingSchema } } }, handler.updateTraining);
  app.delete('/:id', { schema: { tags: ['admin', 'training'], params: schema.GetTrainingParamsSchema, body: schema.DeleteTrainingBodySchema, response: { 200: schema.TrainingSchema } } }, handler.deleteTraining);
};

export default trainingModule;
