import { z } from "@hono/zod-openapi";
import { PaginationSchema } from "@/lib/schema";

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(3),
    email: z.string().email(),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("User");

export const GetUsersQuerySchema = z
  .object({
    search: z
      .string()
      .openapi({ description: "Find users by email" })
      .nullish(),
    sort: UserSchema.keyof().default("name"),
    order: z.enum(["asc", "desc"]).default("asc"),
  })
  .merge(PaginationSchema);

export const UpdateUserSchema = UserSchema.merge(
  z.object({ password: z.string().nullish() })
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const CreateUserSchema = UpdateUserSchema.omit({
  isActive: true,
});
