import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { CreateStackBody, DeleteStackBody, GetStackParams, GetStacksQuery, UpdateStackBody } from './schema';
import * as service from './service';

export const getStacks = async (req: FastifyRequest<{ Querystring: GetStacksQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getStacks(req.query));

export const getStack = async (req: FastifyRequest<{ Params: GetStackParams }>, reply: FastifyReply) => {
  const stack = await service.getStack(req.params.id);
  if (!stack) return reply.status(404).send({ message: 'Stack not found' });
  return reply.status(200).send(stack);
};

export const createStack = async (req: FastifyRequest<{ Body: CreateStackBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createStack(req.body, user!.id));
};

export const updateStack = async (req: FastifyRequest<{ Params: GetStackParams; Body: UpdateStackBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateStack(req.params.id, req.body, user!.id));
};

export const deleteStack = async (req: FastifyRequest<{ Params: GetStackParams; Body: DeleteStackBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteStack(req.params.id, user!.id)
    : await service.softDeleteStack(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
