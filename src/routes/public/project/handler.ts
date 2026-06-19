import { FastifyRequest, FastifyReply } from 'fastify';
import {
  GetPublicProjectsQuery,
  GetPublicProjectParams,
} from './schema';
import * as service from './service';

export const getProjects = async (
  req: FastifyRequest<{ Querystring: GetPublicProjectsQuery }>,
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getProjects(query);
  return reply.status(200).send(result);
};

export const getProject = async (
  req: FastifyRequest<{ Params: GetPublicProjectParams }>,
  reply: FastifyReply
) => {
  const { slug } = req.params;
  const result = await service.getProject(slug);

  if (!result) {
    return reply.status(404).send({ message: 'Project not found' });
  }

  return reply.status(200).send(result);
};
