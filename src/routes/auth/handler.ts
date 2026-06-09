import { FastifyRequest, FastifyReply } from 'fastify';
import * as services from './services';
import { LoginType, RegisterType } from './schema';

export const login = async (req: FastifyRequest<{ Body: LoginType }>, reply: FastifyReply) => {
  const result = await services.loginUser(req.body);
  
  if (!result) {
    return reply.status(401).send({ message: 'Invalid username or password' });
  }

  return reply.status(200).send(result);
};

export const register = async ( req: FastifyRequest<{ Body: RegisterType }>, reply: FastifyReply )  => {
  const { body } = req;

  const result = await services.registerUser(body);

  if (!result) {
    return reply.status(401).send({ message: 'Failed to create account' });
  }

  return reply.status(201).send(result);
}
