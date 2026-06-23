import { FastifyRequest, FastifyReply } from 'fastify';
import { TrackBody, GetViewsQuery } from './schema';
import * as service from './service';

export const handleTrack = async (
  req: FastifyRequest<{ Body: TrackBody }>,
  reply: FastifyReply
) => {
  // x-forwarded-for for requests behind a proxy/load balancer, fallback to req.ip
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]).trim()
    : req.ip ?? null;

  const result = await service.trackAnalytics(req.body, ip);
  return reply.status(200).send(result);
};

export const handleGetViews = async (
  req: FastifyRequest<{ Querystring: GetViewsQuery }>,
  reply: FastifyReply
) => {
  const result = await service.getViews(req.query.path);
  return reply.status(200).send(result);
};