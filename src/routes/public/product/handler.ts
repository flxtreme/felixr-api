import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicProductsQuery, GetPublicProductParams } from './schema';
import * as service from './service';

export const getProducts = async (req: FastifyRequest<{ Querystring: GetPublicProductsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getProducts(req.query));

export const getProduct = async (req: FastifyRequest<{ Params: GetPublicProductParams }>, reply: FastifyReply) => {
  const product = await service.getProduct(req.params.id);
  if (!product) return reply.status(404).send({ message: 'Product not found' });
  return reply.status(200).send(product);
};
