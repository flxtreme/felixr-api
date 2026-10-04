import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { CreateGigBody, DeleteGigBody, GetGigParams, GetGigsQuery, UpdateGigBody } from './schema';
import * as service from './service';

export const getGigs = async (req: FastifyRequest<{ Querystring: GetGigsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getGigs(req.query));

export const getGig = async (req: FastifyRequest<{ Params: GetGigParams }>, reply: FastifyReply) => {
  const gig = await service.getGig(req.params.id);
  if (!gig) return reply.status(404).send({ message: 'Gig not found' });
  return reply.status(200).send(gig);
};

export const createGig = async (req: FastifyRequest<{ Body: CreateGigBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createGig(req.body, user!.id));
};

export const updateGig = async (req: FastifyRequest<{ Params: GetGigParams; Body: UpdateGigBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateGig(req.params.id, req.body, user!.id));
};

export const deleteGig = async (req: FastifyRequest<{ Params: GetGigParams; Body: DeleteGigBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteGig(req.params.id, user!.id)
    : await service.softDeleteGig(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
