import { FastifyRequest, FastifyReply } from 'fastify';
import {
  CreateTagBody,
  UpdateTagBody,
  DeleteTagBody,
  GetTagsQuery,
  GetTagParams,
  SearchTagsQuery,
} from './schema';
import * as service from './service';
import { resolveUser } from '../../../utils';

export const getTags = async (
  req: FastifyRequest<{ Querystring: GetTagsQuery }>,
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getTags(query);
  return reply.status(200).send(result);
};

export const getTag = async (
  req: FastifyRequest<{ Params: GetTagParams }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const result = await service.getTag(id);
  if (!result) return reply.status(404).send(null);
  return reply.status(200).send(result);
};

export const createTag = async (
  req: FastifyRequest<{ Body: CreateTagBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const body = req.body;
  const result = await service.createTag(body, user!.id);
  return reply.status(201).send(result);
};

export const updateTag = async (
  req: FastifyRequest<{ Body: UpdateTagBody; Params: GetTagParams }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const body = req.body;
  const result = await service.updateTag(id, body as UpdateTagBody, user!.id);
  return reply.status(200).send(result);
};

export const deleteTag = async (
  req: FastifyRequest<{ Params: GetTagParams; Body: DeleteTagBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);
  const { id } = req.params;
  const { isPermanent = false } = req.body;
  if (isPermanent) {
    return await service.deleteTag(id, user!.id);
  } else {
    return await service.softDeleteTag(id, user!.id);
  }
};

export const searchTags = async (
  req: FastifyRequest<{ Querystring: SearchTagsQuery }>,
  reply: FastifyReply
) => {
  const { query } = req.query;

  const result = await service.searchTags(query);

  return reply.status(200).send(result);
};
