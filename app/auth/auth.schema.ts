import { z } from "@hono/zod-openapi";
import { UserSchema } from "../users/users.schema";

export const LoginRequestSchema = z.object({
  email: z.string().min(3).openapi({ example: "admin@mail.com" }),
  password: z.string().min(3).openapi({ example: "123456" }),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});
