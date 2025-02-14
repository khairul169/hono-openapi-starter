import { createRoute, z } from "@hono/zod-openapi";
import { LoginRequestSchema, LoginResponseSchema } from "./auth.schema";
import { errorContent, jsonContent } from "@/lib/types";
import { ValidationErrorSchema } from "@/lib/schema";
import { UserSchema } from "../users/users.schema";
import { protectedRoute } from "@/app";

export const login = createRoute({
  operationId: "login",
  tags: ["Auth"],
  method: "post",
  path: "/login",
  summary: "Login",
  description: "Authenticate user using email and password",
  request: {
    body: jsonContent(LoginRequestSchema, "Request body"),
  },
  responses: {
    200: jsonContent(LoginResponseSchema, "Login success"),
    401: errorContent(401, {
      code: "invalid_credentials",
      message: "Username or Password is invalid",
    }),
    403: errorContent(403, {
      code: "user_inactive",
      message: "User is inactive",
    }),
    422: ValidationErrorSchema,
  },
});

export const getUser = protectedRoute({
  operationId: "getUser",
  tags: ["Auth"],
  method: "get",
  path: "/user",
  summary: "Get User",
  description: "Get current authenticated user",
  responses: {
    200: jsonContent(UserSchema, "OK"),
  },
});
