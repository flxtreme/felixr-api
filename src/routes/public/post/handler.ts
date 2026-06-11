import { FastifyRequest, FastifyReply } from 'fastify';
import {
  GetPublicPostsQuery,
  GetPublicPostParams,
} from './schema';
import * as service from './service';

export const getPosts = async (
  req: FastifyRequest<{ Querystring: GetPublicPostsQuery }>, 
  reply: FastifyReply
) => {
  const query = req.query;
  const result = await service.getPosts(query);
  return reply.status(200).send(result);
};

export const getPost = async (
  req: FastifyRequest<{ Params: GetPublicPostParams }>, 
  reply: FastifyReply
) => {
  const { slug } = req.params;
  const result = await service.getPost(slug);
  return reply.status(200).send(result);
};

export const getPage = async (
  req: FastifyRequest<{ Params: GetPublicPostParams }>, 
  reply: FastifyReply
) => {
  const { slug } = req.params;
  const result = await service.getPage(slug);
  return reply.status(200).send(result);
}

export const getPostContent = async (
  req: FastifyRequest<{ Params: GetPublicPostParams }>,
  reply: FastifyReply
) => {
  const { slug } = req.params;
  const content = await service.getPostContent(slug);

  return reply
    .header('Content-Type', 'text/plain; charset=utf-8')
    .header('Content-Encoding', 'identity')
    .status(200).send(content);
};

export const getPostMetadata = async (
  req: FastifyRequest<{ Params: GetPublicPostParams }>,
  reply: FastifyReply
) => {
  const { slug } = req.params;
  const metadata = await service.getPostMetadata(slug);

  return reply
    .header('Content-Type', 'application/json; charset=utf-8')
    .header('Content-Encoding', 'identity')
    .status(200).send(metadata);
}


