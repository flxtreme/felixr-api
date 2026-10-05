import { FastifyInstance } from 'fastify';
import * as handler from './handler';
import * as schema from './schema';

const uploadModule = async (app: FastifyInstance) => {
  app.addHook('onRequest', async (request) => {
    if (
      request.headers['content-type']?.includes('application/json') &&
      (request.method === 'DELETE' || request.headers['content-length'] === '0')
    ) {
      delete request.headers['content-type'];
    }
  });

  app.get('/', { schema: { tags: ['admin', 'upload'], querystring: schema.UploadQuerySchema, response: { 200: schema.UploadListResponseSchema } } }, handler.listUploads);
  app.get('/:id/signed-url', { schema: { tags: ['admin', 'upload'], params: schema.UploadParamsSchema, querystring: schema.SignedUploadUrlQuerySchema, response: { 200: schema.SignedUploadUrlResponseSchema } } }, handler.getSignedUploadUrl);
  app.get('/:id', { schema: { tags: ['admin', 'upload'], params: schema.UploadParamsSchema, response: { 200: schema.UploadSchema } } }, handler.getUpload);
  app.put('/:id', { schema: { tags: ['admin', 'upload'], params: schema.UploadParamsSchema, body: schema.UpdateUploadBodySchema, response: { 200: schema.UploadSchema } } }, handler.updateUpload);
  app.delete('/:id', { schema: { tags: ['admin', 'upload'], params: schema.UploadParamsSchema, response: { 200: schema.DeleteUploadResponseSchema } } }, handler.deleteUpload);
  app.post('/', { schema: { tags: ['admin', 'upload'], consumes: ['multipart/form-data'], response: { 201: schema.UploadSchema } } }, handler.createUpload);
};

export default uploadModule;
