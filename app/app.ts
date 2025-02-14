import { cors } from "hono/cors";
import { jwtMiddleware } from "@/middlewares/auth";
import { createRoute, OpenAPIHono, type RouteConfig } from "@hono/zod-openapi";
import { auth } from "@/middlewares/auth";
import { UnauthorizedErrorSchema } from "../lib/schema";
import errorHandler from "@/middlewares/errorHandler";
import { showRoutes } from "hono/dev";
import env from "@/lib/env";
import { apiReference } from "@scalar/hono-api-reference";
import routes from "./routes";

export function createApp() {
  const app = createRouter()
    //
    .onError(errorHandler)
    .use(cors())
    .use(jwtMiddleware);

  return app as OpenAPIHono;
}

export async function setupRoutes(app: ReturnType<typeof createApp>) {
  for (const route of routes) {
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

export function createRouter() {
  return new OpenAPIHono({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return errorHandler(result.error, c);
      }
    },
  });
}

export function protectedRoute<
  P extends string,
  R extends Omit<RouteConfig, "path"> & {
    path: P;
  }
>(route: R) {
  const middleware =
    route.middleware != null
      ? Array.isArray(route.middleware)
        ? route.middleware
        : [route.middleware]
      : ([] as const);

  return createRoute({
    ...route,
    middleware: [auth(), ...middleware] as const,
    security: [...(route.security || []), { bearer: [] }] as const,
    responses: {
      401: UnauthorizedErrorSchema,
      ...route.responses,
    } as const,
  });
}

export default createApp;
