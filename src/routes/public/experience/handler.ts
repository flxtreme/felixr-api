import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicExperiencesQuery, GetPublicExperienceParams } from './schema';
import * as service from './service';

export const getExperiences = async (req: FastifyRequest<{ Querystring: GetPublicExperiencesQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getExperiences(req.query));

export const getExperience = async (req: FastifyRequest<{ Params: GetPublicExperienceParams }>, reply: FastifyReply) => {
  const experience = await service.getExperience(req.params.id);
  if (!experience) return reply.status(404).send({ message: 'Experience not found' });
  return reply.status(200).send(experience);
};
