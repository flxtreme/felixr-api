import app from "../src/app";

export default async (req, res) => {
  await app.ready();
  app.server.emit("request", req, res);
};