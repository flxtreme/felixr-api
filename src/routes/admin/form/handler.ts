import { FastifyRequest, FastifyReply } from 'fastify';
import * as service from './service';
import { GetByIdParamsType, ListQueryType } from '../../../core/schema';
import { CreateFormBody, DeleteFormBody, GetFormsQuery, GetFormSubmissionsQuery, SubmitFormBody, UpdateFormBody } from './schema';
import { resolveUser, getClientIp, getUserAgent } from '../../../utils';

export const getFormsHandler = async (
  req: FastifyRequest<{ Querystring: GetFormsQuery }>,
  reply: FastifyReply
) => {
  const forms = await service.getForms(req.query);
  return reply.status(200).send(forms);
};

export const getForm = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const form = await service.getForm(id);

  if (!form) {
    return reply.status(404).send({ message: 'Form not found' });
  }

  return reply.status(200).send(form);
};

export const createForm = async (
  req: FastifyRequest<{ Body: CreateFormBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const form = await service.createForm(req.body, user!.id);
  return reply.status(201).send(form);
};

export const updateForm = async (
  req: FastifyRequest<{ Body: UpdateFormBody, Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const form = await service.updateForm(id, req.body, user!.id);
  return reply.status(200).send(form);
};

export const deleteForm = async (
  req: FastifyRequest<{ Params: GetByIdParamsType, Body: DeleteFormBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { isPermanent } = req.body;

  if (isPermanent) {
    const result = await service.deleteForm(id, user!.id);
    return reply.status(200).send(result);
  } else {
    const result = await service.softDeleteForm(id, user!.id);
    return reply.status(200).send(result);
  }
};

export const getFormSubmissionsHandler = async (
  req: FastifyRequest<{ Querystring: GetFormSubmissionsQuery }>,
  reply: FastifyReply
) => {
  const submissions = await service.getFormSubmissions(req.query);
  return reply.status(200).send(submissions);
};

export const getFormSubmission = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const submission = await service.getFormSubmission(id);

  if (!submission) {
    return reply.status(404).send({ message: 'Submission not found' });
  }

  return reply.status(200).send(submission);
};

export const submitForm = async (
  req: FastifyRequest<{ Params: GetByIdParamsType, Body: SubmitFormBody }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const user = resolveUser(req);
  const ipAddress = getClientIp(req);
  const userAgent = getUserAgent(req);

  try {
    const result = await service.createFormSubmission(id, req.body, user?.id, ipAddress, userAgent);
    return reply.status(201).send(result);
  } catch (err: any) {
    if (err.message === 'Form not found') {
      return reply.status(404).send({ message: err.message });
    }
    if (err.message === 'Form is not published') {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
};