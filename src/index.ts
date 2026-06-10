import app from "./app";
import { config } from "./core/config";

app.listen({ port: config.port, host: '0.0.0.0' }).catch((err) => {
  console.error(err);
  process.exit(1);
}).then(() => {
  console.log(`Server listening on port ${config.port}`);
});