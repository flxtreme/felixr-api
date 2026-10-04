import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const experienceModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'experience'], querystring: schema.GetExperiencesQuerySchema, response: { 200: schema.GetExperiencesResponseSchema } } }, handler.getExperiences);
  app.get('/:id', { schema: { tags: ['admin', 'experience'], params: schema.GetExperienceParamsSchema, response: { 200: schema.ExperienceSchema } } }, handler.getExperience);
  app.post('/', { schema: { tags: ['admin', 'experience'], body: schema.CreateExperienceBodySchema, response: { 201: schema.ExperienceSchema } } }, handler.createExperience);
  app.put('/:id', { schema: { tags: ['admin', 'experience'], params: schema.GetExperienceParamsSchema, body: schema.UpdateExperienceBodySchema, response: { 200: schema.ExperienceSchema } } }, handler.updateExperience);
  app.delete('/:id', { schema: { tags: ['admin', 'experience'], params: schema.GetExperienceParamsSchema, body: schema.DeleteExperienceBodySchema, response: { 200: schema.ExperienceSchema } } }, handler.deleteExperience);
};

export default experienceModule;
