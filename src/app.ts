import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routesPlugin } from '../src/routes/';
import { swaggerPlugin } from '../src/core/swagger';
import { config } from '../src/core/config';
import { loggerOptions } from '../src/core/logger';

const app = Fastify({
    logger: loggerOptions
});

app.register(cors, {
    origin: 'http://localhost:3000'
});

app.register(swaggerPlugin);

app.register(routesPlugin, { prefix: config.apiPrefix });

export default app;
