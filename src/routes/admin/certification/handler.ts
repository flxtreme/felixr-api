import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { CreateCertificationBody, DeleteCertificationBody, GetCertificationParams, GetCertificationsQuery, UpdateCertificationBody } from './schema';
import * as service from './service';

export const getCertifications = async (req: FastifyRequest<{ Querystring: GetCertificationsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getCertifications(req.query));

export const getCertification = async (req: FastifyRequest<{ Params: GetCertificationParams }>, reply: FastifyReply) => {
  const certification = await service.getCertification(req.params.id);
  if (!certification) return reply.status(404).send({ message: 'Certification not found' });
  return reply.status(200).send(certification);
};

export const createCertification = async (req: FastifyRequest<{ Body: CreateCertificationBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createCertification(req.body, user!.id));
};

export const updateCertification = async (req: FastifyRequest<{ Params: GetCertificationParams; Body: UpdateCertificationBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateCertification(req.params.id, req.body, user!.id));
};

export const deleteCertification = async (req: FastifyRequest<{ Params: GetCertificationParams; Body: DeleteCertificationBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteCertification(req.params.id, user!.id)
    : await service.softDeleteCertification(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
