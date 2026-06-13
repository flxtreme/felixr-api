import { FastifyRequest, FastifyReply } from 'fastify';
import * as service from './service';
import { GetByIdParamsType, ListQueryType, UserRequestType } from '../../../core/schema';
import { CreatePostBody, DeletePostBody, UpdatePostBody } from './schema';
import { resolveUser } from '../../../utils';

export const getPostsHandler = async (
  req: FastifyRequest<{ Querystring: ListQueryType }>, 
  reply: FastifyReply
) => {

  const posts = await service.getPosts(req.query);
  
  return reply.status(200).send(posts);
};

export const getPost = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const post = await service.getPost(id);

  return reply.status(200).send(post);
};

export const getPostContent = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const content = await service.getPostContent(id);

  return reply
    .header('Content-Type', 'text/plain; charset=utf-8')
    .header('Content-Encoding', 'identity')
    .status(200).send(content);
};

export const getPostMetadata = async (
  req: FastifyRequest<{ Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const metadata = await service.getPostMetadata(id);

  return reply
    .header('Content-Type', 'application/json; charset=utf-8')
    .header('Content-Encoding', 'identity')
    .status(200).send(metadata);
}

export const createPost = async (
  req: FastifyRequest<{ Body: CreatePostBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const body = req.body;

  const post = await service.createPost(body, user!.id);

  return reply.status(201).send(post);
}

export const updatePost = async (
  req: FastifyRequest<{ Body: UpdatePostBody, Params: GetByIdParamsType }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const { id } = req.params;

  const body = req.body;

  const post = await service.updatePost(id, body, user!.id);

  return reply.status(200).send(post);
}


export const deletePost = async (
  req: FastifyRequest<{ Params: GetByIdParamsType, Body: DeletePostBody }>,
  reply: FastifyReply
) => {
  const user = resolveUser(req);

  const { id } = req.params;

  const post = await service.deletePost(id, user.id);

  return reply.status(200).send(post);
}

