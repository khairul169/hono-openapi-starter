import {
  CreateUserSchema,
  GetUsersQuerySchema,
  UpdateUserSchema,
  UserSchema,
} from "./users.schema";
import { errorContent, jsonContent } from "@/lib/types";
import { protectedRoute } from "@/app";
import {
  NotFoundErrorSchema,
  IDRequestParams,
  paginatedSchema,
} from "@/lib/schema";

export const list = protectedRoute({
  operationId: "list",
  tags: ["Users"],
  method: "get",
  path: "/",
  summary: "List",
  description: "Get all users",
  request: {
    query: GetUsersQuerySchema,
  },
  responses: {
    200: jsonContent(paginatedSchema(UserSchema), "OK"),
  },
});

export const get = protectedRoute({
  operationId: "get",
  tags: ["Users"],
  method: "get",
  path: "/:id",
  summary: "Get",
  description: "Get user by id",
  request: {
    params: IDRequestParams,
  },
  responses: {
    200: jsonContent(UserSchema, "OK"),
    404: NotFoundErrorSchema,
  },
});

export const create = protectedRoute({
  operationId: "create",
  tags: ["Users"],
  method: "post",
  path: "/",
  summary: "Create",
  description: "Create a new user",
  request: {
    body: jsonContent(CreateUserSchema, "Request body"),
  },
  responses: {
    201: jsonContent(UserSchema, "OK"),
    400: errorContent(400, {
      code: "user_exists",
      message: "Email address already registered",
    }),
  },
});

export const update = protectedRoute({
  operationId: "update",
  tags: ["Users"],
  method: "put",
  path: "/:id",
  summary: "Update",
  description: "Update existing user",
  request: {
    params: IDRequestParams,
    body: jsonContent(UpdateUserSchema, "Request body"),
  },
  responses: {
    200: jsonContent(UserSchema, "OK"),
    400: errorContent(400, {
      code: "user_exists",
      message: "Email address already registered",
    }),
    404: NotFoundErrorSchema,
  },
});

export const remove = protectedRoute({
  operationId: "remove",
  tags: ["Users"],
  method: "delete",
  path: "/:id",
  summary: "Delete",
  description: "Delete existing user",
  request: {
    params: IDRequestParams,
  },
  responses: {
    204: { description: "OK" },
    404: NotFoundErrorSchema,
  },
});
