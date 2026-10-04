import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicStacksQuery, GetPublicStackParams } from './schema';
import * as service from './service';

export const getStacks = async (req: FastifyRequest<{ Querystring: GetPublicStacksQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getStacks(req.query));

export const getStack = async (req: FastifyRequest<{ Params: GetPublicStackParams }>, reply: FastifyReply) => {
  const stack = await service.getStack(req.params.id);
  if (!stack) return reply.status(404).send({ message: 'Stack not found' });
  return reply.status(200).send(stack);
};
