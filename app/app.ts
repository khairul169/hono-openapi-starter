import path from "path";
import { cors } from "hono/cors";
import { jwtMiddleware } from "@/middlewares/auth";
import { createRouter } from "@/app/route";
import { showRoutes } from "hono/dev";
import env from "@/lib/env";
import { apiReference } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";
import errorHandler from "../middlewares/errorHandler";

export function createApp() {
  const app = createRouter()
    //
    .onError(errorHandler)
    .use(cors())
    .use(jwtMiddleware);

  return app;
}

export async function setupRoutes(app: ReturnType<typeof createApp>) {
  const glob = new Bun.Glob("./app/**/*.index.ts");

  // Scan routers
  for await (const file of glob.scan(".")) {
    const { default: route } = await import(path.resolve(process.cwd(), file));
    app.route("/", route);
  }

  if (env.DEV) {
    const ln = "-".repeat(40);
    console.log(ln + "\nRegistered routes:\n" + ln);
    showRoutes(app);
    console.log(ln + "\n");
  }
}

export function setupOpenAPI(app: OpenAPIHono) {
  const specUrl = "/openapi.json";

  app.doc(specUrl, (c) => ({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "OpenAPI",
    },
    servers: [
      {
        url: new URL(c.req.url).origin,
        description: "Current environment",
      },
    ],
  }));

  app.get(
    "/api-docs",
    apiReference({
      pageTitle: "API Docs",
      spec: { url: specUrl },
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "fetch",
      },
      authentication: {
        preferredSecurityScheme: "bearer",
      },
    })
  );

  app.openAPIRegistry.registerComponent("securitySchemes", "bearer", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  });

  setTimeout(() => {
    console.log(`\nOpenAPI spec:\thttp://localhost:${env.PORT}${specUrl}`);
    console.log(`API docs:\thttp://localhost:${env.PORT}/api-docs\n`);
  }, 10);
}

export default createApp;
