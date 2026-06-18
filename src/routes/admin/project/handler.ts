import { FastifyRequest, FastifyReply } from 'fastify';
import * as service from './service';
import { GetByIdParamsType, ListQueryType } from '../../../core/schema';
import { CreateProjectBody, DeleteProjectBody, UpdateProjectBody } from './schema';
import { resolveUser } from '../../../utils';

export const getProjectsHandler = async (
  req: FastifyRequest<{ Querystring: ListQueryType }>,
  reply: FastifyReply
) => {
  const projects = await service.getProjects(req.query);
  return reply.status(200).send(projects);
};

export const getProjectHandler = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const project = await service.getProject(id);
  return reply.status(200).send(project);
};

export const createProjectHandler = async (
  req: FastifyRequest<{ Body: CreateProjectBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const project = await service.createProject(req.body, user!.id);
  return reply.status(201).send(project);
};

export const updateProjectHandler = async (
  req: FastifyRequest<{ Body: UpdateProjectBody; Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const project = await service.updateProject(id, req.body, user!.id);
  return reply.status(200).send(project);
};

export const deleteProjectHandler = async (
  req: FastifyRequest<{ Params: GetByIdParamsType; Body: DeleteProjectBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { isPermanent } = req.body;

  if (isPermanent) {
    const result = await service.deleteProject(id, user.id);
    return reply.status(200).send(result);
  } else {
    const result = await service.softDeleteProject(id, user.id);
    return reply.status(200).send(result);
  }
};