import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const certificationModule = async (app: FastifyInstance) => {
  app.get('/', { schema: { tags: ['admin', 'certification'], querystring: schema.GetCertificationsQuerySchema, response: { 200: schema.GetCertificationsResponseSchema } } }, handler.getCertifications);
  app.get('/:id', { schema: { tags: ['admin', 'certification'], params: schema.GetCertificationParamsSchema, response: { 200: schema.CertificationSchema } } }, handler.getCertification);
  app.post('/', { schema: { tags: ['admin', 'certification'], body: schema.CreateCertificationBodySchema, response: { 201: schema.CertificationSchema } } }, handler.createCertification);
  app.put('/:id', { schema: { tags: ['admin', 'certification'], params: schema.GetCertificationParamsSchema, body: schema.UpdateCertificationBodySchema, response: { 200: schema.CertificationSchema } } }, handler.updateCertification);
  app.delete('/:id', { schema: { tags: ['admin', 'certification'], params: schema.GetCertificationParamsSchema, body: schema.DeleteCertificationBodySchema, response: { 200: schema.CertificationSchema } } }, handler.deleteCertification);
};

export default certificationModule;
