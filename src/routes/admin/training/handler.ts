import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from '../../../utils';
import { CreateTrainingBody, DeleteTrainingBody, GetTrainingParams, GetTrainingsQuery, UpdateTrainingBody } from './schema';
import * as service from './service';

export const getTrainings = async (req: FastifyRequest<{ Querystring: GetTrainingsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getTrainings(req.query));

export const getTraining = async (req: FastifyRequest<{ Params: GetTrainingParams }>, reply: FastifyReply) => {
  const training = await service.getTraining(req.params.id);
  if (!training) return reply.status(404).send({ message: 'Training not found' });
  return reply.status(200).send(training);
};

export const createTraining = async (req: FastifyRequest<{ Body: CreateTrainingBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(201).send(await service.createTraining(req.body, user!.id));
};

export const updateTraining = async (req: FastifyRequest<{ Params: GetTrainingParams; Body: UpdateTrainingBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  return reply.status(200).send(await service.updateTraining(req.params.id, req.body, user!.id));
};

export const deleteTraining = async (req: FastifyRequest<{ Params: GetTrainingParams; Body: DeleteTrainingBody }>, reply: FastifyReply) => {
  const user = resolveUser(req);
  const deleted = req.body.isPermanent
    ? await service.deleteTraining(req.params.id, user!.id)
    : await service.softDeleteTraining(req.params.id, user!.id);
  return reply.status(200).send(deleted);
};
