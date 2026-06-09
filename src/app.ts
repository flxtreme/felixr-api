import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routesPlugin } from '@routes/index';
import { swaggerPlugin } from '@core/swagger';
import { config } from '@core/config';
import { loggerOptions } from '@core/logger';

const app = Fastify({
    logger: loggerOptions
});

app.register(cors, {
    origin: 'http://localhost:3000'
});

app.register(swaggerPlugin);

app.register(routesPlugin, { prefix: config.apiPrefix });

export default app;
