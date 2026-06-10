import { FastifyRequest, FastifyReply } from 'fastify';
import {
  CreateUserBody,
  UpdateUserBody,
  DeleteUserBody,
  GetUsersQuery,
  GetUserParams,
} from './schema';
import * as service from './service';
import { resolveUser } from '../../../utils';

export const getUsers = async (
  req: FastifyRequest<{ Querystring: GetUsersQuery }>,
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getUsers(query);
  return reply.status(200).send(result);
};

export const getUser = async (
  req: FastifyRequest<{ Params: GetUserParams }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const result = await service.getUser(id);
  if (!result) return reply.status(404).send(null);
  return reply.status(200).send(result);
};

export const createUser = async (
  req: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const body = req.body;
  const result = await service.createUser(body, user!.id);
  return reply.status(201).send(result);
};

export const updateUser = async (
  req: FastifyRequest<{ Body: UpdateUserBody; Params: GetUserParams }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const body = req.body;
  const result = await service.updateUser(id, body, user!.id);
  return reply.status(200).send(result);
};

export const deleteUser = async (
  req: FastifyRequest<{ Params: GetUserParams; Body: DeleteUserBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { isPermanent = false } = req.body;
  if (isPermanent) {
    return await service.deleteUser(id, user!.id);
  } else {
    return await service.softDeleteUser(id, user!.id);
  }
};
