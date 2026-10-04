import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { CreateProductBody, DeleteProductBody, GetProductParams, GetProductsQuery, UpdateProductBody } from './schema';
import * as service from './service';

export const getProducts = async (req: FastifyRequest<{ Querystring: GetProductsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getProducts(req.query));

export const getProduct = async (req: FastifyRequest<{ Params: GetProductParams }>, reply: FastifyReply) => {
  const product = await service.getProduct(req.params.id);
  if (!product) return reply.status(404).send({ message: 'Product not found' });
  return reply.status(200).send(product);
};

export const createProduct = async (req: FastifyRequest<{ Body: CreateProductBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createProduct(req.body, user!.id));
};

export const updateProduct = async (req: FastifyRequest<{ Params: GetProductParams; Body: UpdateProductBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateProduct(req.params.id, req.body, user!.id));
};

export const deleteProduct = async (req: FastifyRequest<{ Params: GetProductParams; Body: DeleteProductBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteProduct(req.params.id, user!.id)
    : await service.softDeleteProduct(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
