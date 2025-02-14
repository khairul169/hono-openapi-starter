import env from "./lib/env";
import createApp, { setupOpenAPI, setupRoutes } from "./app/app";

const app = createApp();
await setupRoutes(app);

// Configure api docs
setupOpenAPI(app);

if (!env.DEV) {
  console.log(`Server started!\thttp://localhost:${env.PORT}\n`);
}

export default {
  port: env.PORT,
  fetch: app.fetch,
};
