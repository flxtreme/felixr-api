import { FastifyRequest, FastifyReply } from 'fastify';
import {
  CreateRoleBody,
  UpdateRoleBody,
  DeleteRoleBody,
  GetRolesQuery,
  GetRoleParams,
} from './schema';
import * as service from './service';
import * as permService from '../../admin/permission/service';

import { resolveUser } from '../../../utils';

export const getRoles = async (
  req: FastifyRequest<{ Querystring: GetRolesQuery }>,
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getRoles(query);
  return reply.status(200).send(result);
};

export const getRole = async (
  req: FastifyRequest<{ Params: GetRoleParams }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const result = await service.getRole(id);
  if (!result) return reply.status(404).send(null);
  return reply.status(200).send(result);
};

export const createRole = async (
  req: FastifyRequest<{ Body: CreateRoleBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const body = req.body;
  const result = await service.createRole(body, user!.id);
  return reply.status(201).send(result);
};

export const updateRole = async (
  req: FastifyRequest<{ Body: UpdateRoleBody; Params: GetRoleParams }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const body = req.body;
  const result = await service.updateRole(id, body, user!.id);
  return reply.status(200).send(result);
};

export const deleteRole = async (
  req: FastifyRequest<{ Params: GetRoleParams; Body: DeleteRoleBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { isPermanent = false } = req.body;
  if (isPermanent) {
    return await service.deleteRole(id, user!.id);
  } else {
    return await service.softDeleteRole(id, user!.id);
  }
};

export const addPermission = async(
  req: FastifyRequest<{ Body: { roleId: string, permissionId: string }}>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const { roleId, permissionId } = req.body;
  const [
    permission,
    role
  ] = await Promise.all([
    permService.getPermission(permissionId),
    service.getRole(roleId)
  ]);

  if (!permission) return reply.status(404).send({ message: 'Permission not found' });
  if (!role) return reply.status(404).send({ message: 'Role not found' });

  const result = await service.addPermission(roleId, permissionId, user!.id);

  return reply.status(200).send({
    role,
    permission,
    rolePermission: result
  });
}
