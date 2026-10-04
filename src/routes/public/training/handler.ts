import { FastifyReply, FastifyRequest } from 'fastify';
import { GetPublicTrainingsQuery, GetPublicTrainingParams } from './schema';
import * as service from './service';

export const getTrainings = async (req: FastifyRequest<{ Querystring: GetPublicTrainingsQuery }>, reply: FastifyReply) =>
  reply.status(200).send(await service.getTrainings(req.query));

export const getTraining = async (req: FastifyRequest<{ Params: GetPublicTrainingParams }>, reply: FastifyReply) => {
  const training = await service.getTraining(req.params.id);
  if (!training) return reply.status(404).send({ message: 'Training not found' });
  return reply.status(200).send(training);
};
