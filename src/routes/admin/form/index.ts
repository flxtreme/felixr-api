import { FastifyInstance } from 'fastify';
import { GetByIdParamsSchema } from '../../../core/schema';
import { CreateFormBodySchema, DeleteFormBodySchema, FormSchema, FormSubmissionSchema, GetFormsQuerySchema, GetFormsResponseSchema, GetFormSubmissionsQuerySchema, GetFormSubmissionsResponseSchema, SubmitFormBodySchema, SubmitFormResponseSchema, UpdateFormBodySchema } from './schema';
import * as handler from './handler';

export default async function formRoutes(fastify: FastifyInstance) {
  fastify.get('/forms', {
    schema: {
      querystring: GetFormsQuerySchema,
      response: { 200: GetFormsResponseSchema },
    },
  }, handler.getFormsHandler);

  fastify.get('/forms/:id', {
    schema: {
      params: GetByIdParamsSchema,
      response: { 200: FormSchema, 404: { type: 'object', properties: { message: { type: 'string' } } } },
    },
  }, handler.getForm);

  fastify.post('/forms', {
    schema: {
      body: CreateFormBodySchema,
      response: { 201: FormSchema },
    },
  }, handler.createForm);

  fastify.patch('/forms/:id', {
    schema: {
      params: GetByIdParamsSchema,
      body: UpdateFormBodySchema,
      response: { 200: FormSchema, 404: { type: 'object', properties: { message: { type: 'string' } } } },
    },
  }, handler.updateForm);

  fastify.delete('/forms/:id', {
    schema: {
      params: GetByIdParamsSchema,
      body: DeleteFormBodySchema,
      response: { 200: FormSchema, 404: { type: 'object', properties: { message: { type: 'string' } } } },
    },
  }, handler.deleteForm);

  fastify.get('/submissions', {
    schema: {
      querystring: GetFormSubmissionsQuerySchema,
      response: { 200: GetFormSubmissionsResponseSchema },
    },
  }, handler.getFormSubmissionsHandler);

  fastify.get('/submissions/:id', {
    schema: {
      params: GetByIdParamsSchema,
      response: { 200: FormSubmissionSchema, 404: { type: 'object', properties: { message: { type: 'string' } } } },
    },
  }, handler.getFormSubmission);

  fastify.post('/forms/:id/submit', {
    schema: {
      params: GetByIdParamsSchema,
      body: SubmitFormBodySchema,
      response: { 201: SubmitFormResponseSchema, 400: { type: 'object', properties: { message: { type: 'string' } } }, 404: { type: 'object', properties: { message: { type: 'string' } } } },
      // Public endpoint - mark as public to skip auth
      config: { public: true },
    },
  }, handler.submitForm);
}