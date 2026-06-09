import { FastifyRequest, FastifyReply } from 'fastify';
import {
  GetPublicTagsQuery,
  GetPublicTagParams,
} from './schema';
import * as service from './service';

export const getPublicTags = async (
  req: FastifyRequest<{ Querystring: GetPublicTagsQuery }>,
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getPublicTags(query);
  return reply.status(200).send(result);
};

export const getPublicTag = async (
  req: FastifyRequest<{ Params: GetPublicTagParams, Querystring: GetPublicTagsQuery}>,
  reply: FastifyReply
) => {
  const { query, params: { slug } } = req;

  const result = await service.getPublicTag(slug, query);

  if (!result) return reply.status(404).send(null);
  return reply.status(200).send(result);
};