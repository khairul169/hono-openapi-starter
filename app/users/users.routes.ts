import { GetUsersQuerySchema, UserSchema } from "./users.schema";
import { jsonContent } from "@/lib/types";
import { protectedRoute } from "@/app/route";
import { paginatedSchema } from "@/lib/schema";

export const getAll = protectedRoute({
  operationId: "getAll",
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

export const getUser = protectedRoute({
  operationId: "getUser",
  tags: ["Users"],
  method: "get",
  path: "/me",
  summary: "Get User",
  description: "Get current authenticated user",
  responses: {
    200: jsonContent(UserSchema, "OK"),
  },
});
