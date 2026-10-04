import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicExperienceModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'experience'], querystring: schema.GetPublicExperiencesQuerySchema, response: { 200: schema.GetPublicExperiencesResponseSchema } } }, handler.getExperiences);
  app.get('/:id', { schema: { tags: ['public', 'experience'], params: schema.GetPublicExperienceParamsSchema, response: { 200: schema.PublicExperienceSchema } } }, handler.getExperience);
};

export default publicExperienceModule;
