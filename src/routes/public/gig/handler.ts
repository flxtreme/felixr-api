import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicGigsQuery, GetPublicGigParams } from './schema';
import * as service from './service';

export const getGigs = async (req: FastifyRequest<{ Querystring: GetPublicGigsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getGigs(req.query));

export const getGig = async (req: FastifyRequest<{ Params: GetPublicGigParams }>, reply: FastifyReply) => {
  const gig = await service.getGig(req.params.id);
  if (!gig) return reply.status(404).send({ message: 'Gig not found' });
  return reply.status(200).send(gig);
};
