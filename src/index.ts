import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import { routesPlugin } from './routes';
import { swaggerPlugin } from './core/swagger';
import prismaErrorPlugin from './core/prismaError';
import { config } from './core/config';

const app = Fastify();

// Install multipart parsing at the root so nested upload routes inherit it.
app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024 } });

app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000'
});

app.register(swaggerPlugin);
app.register(prismaErrorPlugin);
app.register(routesPlugin, { prefix: config.apiPrefix });

app.listen({ port: config.port, host: config.host }).then((_) => {
  console.log(`Server running on port http://${config.host}:${config.port}`)
})
