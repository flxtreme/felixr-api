import { FastifyRequest, FastifyReply } from 'fastify';
import { TrackBody } from './schema';
import * as service from './service';

export const handleTrack = async (
  req: FastifyRequest<{ Body: TrackBody }>,
  reply: FastifyReply
) => {
  const result = await service.trackAnalytics(req.body);
  return reply.status(200).send(result);
};
