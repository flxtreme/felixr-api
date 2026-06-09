import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { config } from '../core/config';
import { UserRequestType } from './schema';
import { User } from '@prisma/client';
import { prisma } from './prisma';

declare module 'fastify' {
  interface FastifyContextConfig {
    public?: boolean;
  }
  interface FastifyRequest {
    user?: UserRequestType;
  }
}

const getUserById = async (id: string): Promise<UserRequestType | null> => {
  const userRaw = await prisma.user.findUnique({
    include: {userRoles: { include: { role: true } } },
    where: { id, isDeleted: false },
  });

  if (userRaw) {
    return parseRequestUser(userRaw);
  }

  return null;
};

const getUserByEmail = async (email: string): Promise<UserRequestType | null> => {
  const userRaw = await prisma.user.findUnique({
    include: {userRoles: { include: { role: true } } },
    where: { email, isDeleted: false },
  });

  if (userRaw) {
    return parseRequestUser(userRaw);
  }

  return null;
};

export const parseRequestUser = (user: User & { userRoles: { role: { name: string } }[] }): UserRequestType => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    roles: user.userRoles.map(ur => ur.role.name)
  };
}


const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request, reply) => {
    if (request.routeOptions.config.public) {
      return;
    }

    // Use brackets for safer header access in case of non-standard normalization
    const authHeader = request.headers['authorization'] || request.headers['Authorization'] as string | undefined;
    const apiKey = request.headers['x-api-key'];

    let authError: any = null;

    if (!authHeader && !apiKey) {
      request.log.debug({ headers: request.headers }, 'Auth check failed: No credentials found');
    }

    console.log('Auth header:', authHeader);

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id?: string; email?: string };
        let user: UserRequestType | null = null;

        if (decoded.id) {
          user = await getUserById(decoded.id);
        } else if (decoded.email) {
          user = await getUserByEmail(decoded.email);
        }

        if (user) {
          request.user = user;
          return;
        }
        authError = new Error('User not found');
      } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
          return reply.status(403).send({
            statusCode: 403,
            message: 'Your session has expired. Please log in again.',
          });
        }
        authError = error;
      }
    }

    if (apiKey && apiKey === config.apiKey && config.apiKey !== "") {
      request.user = { id: 'api', email: 'api@felixr.dev', username: 'felixrapi', name: 'felixrapi', roles: ['admin'] };
      return;
    }

    if (authError) {
      console.log('Authentication error:', authError);
      return reply.status(401).send({ message: authError.message });
    }

    return reply.status(401).send({ message: 'Unauthorized access' });
  });
};

export default fp(authPlugin);