import env from "./lib/env";
import createApp, { setupOpenAPI, setupRoutes } from "./app";

const app = createApp();
await setupRoutes(app);
await setupOpenAPI(app);

if (!env.DEV) {
  console.log(`Server started!\thttp://localhost:${env.PORT}\n`);
}

export default {
  port: env.PORT,
  fetch: app.fetch,
};
