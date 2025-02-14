import { z } from "@hono/zod-openapi";
import { PaginationSchema } from "@/lib/schema";
import { createSelectSchema } from "drizzle-zod";
import { schema } from "@/db";

export const UserSchema = createSelectSchema(schema.users)
  .omit({ password: true })
  .openapi("User");

export const GetUsersQuerySchema = z
  .object({
    search: z
      .string()
      .openapi({ description: "Find users by email" })
      .nullish(),
  })
  .merge(PaginationSchema);

export const UpdateUserSchema = createSelectSchema(schema.users, {
  email: (t) => t.min(3),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateUserSchema = UpdateUserSchema.omit({
  isActive: true,
});
