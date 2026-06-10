import app from './app';
import { config } from './core/config';

const start = async () => {
  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Server running at http://${config.host}:${config.port}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
