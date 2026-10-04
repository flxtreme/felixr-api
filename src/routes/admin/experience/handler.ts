import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { DeleteExperienceBody, GetExperienceParams, GetExperiencesQuery, CreateExperienceBody, UpdateExperienceBody } from './schema';
import * as service from './service';

export const getExperiences = async (req: FastifyRequest<{ Querystring: GetExperiencesQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getExperiences(req.query));

export const getExperience = async (req: FastifyRequest<{ Params: GetExperienceParams }>, reply: FastifyReply) => {
  const experience = await service.getExperience(req.params.id);
  if (!experience) return reply.status(404).send({ message: 'Experience not found' });
  return reply.status(200).send(experience);
};

export const createExperience = async (req: FastifyRequest<{ Body: CreateExperienceBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createExperience(req.body, user!.id));
};

export const updateExperience = async (req: FastifyRequest<{ Params: GetExperienceParams; Body: UpdateExperienceBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateExperience(req.params.id, req.body, user!.id));
};

export const deleteExperience = async (req: FastifyRequest<{ Params: GetExperienceParams; Body: DeleteExperienceBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteExperience(req.params.id, user!.id)
    : await service.softDeleteExperience(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
