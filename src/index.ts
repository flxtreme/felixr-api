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

app.listen({ port: config.port, host: config.host }).then((_) => {
  console.log(`Server running on port http//:${config.host}/${config.port}`)
})