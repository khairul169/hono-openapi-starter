import { createRoute, OpenAPIHono, type RouteConfig } from "@hono/zod-openapi";
import { auth } from "../middlewares/auth";
import { UnauthorizedErrorSchema } from "../lib/schema";
import errorHandler from "../middlewares/errorHandler";

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
