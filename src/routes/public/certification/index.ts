import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const publicCertificationModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['public', 'certification'], querystring: schema.GetPublicCertificationsQuerySchema, response: { 200: schema.GetPublicCertificationsResponseSchema } } }, handler.getCertifications);
  app.get('/:id', { schema: { tags: ['public', 'certification'], params: schema.GetPublicCertificationParamsSchema, response: { 200: schema.PublicCertificationSchema } } }, handler.getCertification);
};

export default publicCertificationModule;
