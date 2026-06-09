import app from '../src/app';

module.exports = async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};