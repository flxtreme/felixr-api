import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routesPlugin } from './routes';
import { swaggerPlugin } from './core/swagger';
import { config } from './core/config';

const app = Fastify();

app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000'
});

app.register(swaggerPlugin);
app.register(routesPlugin, { prefix: config.apiPrefix });

export default app;