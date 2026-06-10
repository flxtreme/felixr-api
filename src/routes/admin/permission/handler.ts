import { FastifyRequest, FastifyReply } from 'fastify';
import {
  CreatePermissionBody,
  UpdatePermissionBody,
  DeletePermissionBody,
  GetPermissionsQuery,
  GetPermissionParams,
} from './schema';
import * as service from './service';
import { resolveUser } from '../../../utils';

export const getPermissions = async (
  req: FastifyRequest<{ Querystring: GetPermissionsQuery }>, 
  reply: FastifyReply
) => {
  const query = req.query;

  const result = await service.getPermissions(query);

  return reply.status(200).send(result);
};

export const getPermission = async (
  req: FastifyRequest<{ Params: GetPermissionParams }>, 
  reply: FastifyReply
) => {
  const { id } = req.params;

  const result = await service.getPermission(id);

  if(!result) return reply.status(200).send(result);


  return reply.status(200).send(result);
};

export const createPermission = async (
  req: FastifyRequest<{ Body: CreatePermissionBody }>, 
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const body = req.body;

  const result = await service.createPermission(body, user!.id);

  return reply.status(201).send(result);
};

export const updatePermission = async (
  req: FastifyRequest<{ Body: UpdatePermissionBody, Params: GetPermissionParams }>, 
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const { id } = req.params;

  const body = req.body;

  const result = await service.updatePermission(id, body, user!.id);

  return reply.status(200).send(result);
};

export const deletePermission = async (
  req: FastifyRequest<{ Params: GetPermissionParams, Body: DeletePermissionBody }>, 
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const { id } = req.params;

  const { isPermanent = false }  = req.body;
  
  if (isPermanent) {
    return await service.deletePermission(id, user!.id);
  } else {
    return await service.softDeletePermission(id, user!.id);
  }
};

