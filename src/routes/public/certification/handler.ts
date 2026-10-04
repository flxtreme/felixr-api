import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicCertificationsQuery, GetPublicCertificationParams } from './schema';
import * as service from './service';

export const getCertifications = async (req: FastifyRequest<{ Querystring: GetPublicCertificationsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getCertifications(req.query));

export const getCertification = async (req: FastifyRequest<{ Params: GetPublicCertificationParams }>, reply: FastifyReply) => {
  const certification = await service.getCertification(req.params.id);
  if (!certification) return reply.status(404).send({ message: 'Certification not found' });
  return reply.status(200).send(certification);
};
