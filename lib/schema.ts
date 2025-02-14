import { z } from "@hono/zod-openapi";
import { errorContent } from "./types";

export const TimestampSchema = z.object({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullish(),
});

export const ValidationErrorSchema = errorContent(422, {
  code: "validation_error",
  message: "Validation Error",
});

export const UnauthorizedErrorSchema = errorContent(401, {
  code: "unauthorized",
  message: "Unauthorized",
});

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const paginatedSchema = <T extends z.ZodSchema>(schema: T) => {
  return z.object({
    total: z.number().openapi({ example: 1 }),
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 10 }),
    rows: z.array(schema),
  });
};
