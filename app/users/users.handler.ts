import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./users.routes";
import db from "@/db";
import { eq, ilike } from "drizzle-orm";
import { APIError } from "@/lib/types";
import { omit } from "@/lib/utils";
import { users } from "@/db/schema";
import { and, paginate } from "@/db/utils";

/**
 * Get all users
 */
export const getAll: RouteHandler<typeof routes.getAll> = async (c) => {
  const { page, limit, search } = c.req.valid("query");

  const query = db
    .select()
    .from(users)
    .where(and(search && ilike(users.email, `%${search}%`)))
    .$dynamic();

  const [result, total] = await paginate(query, page, limit);
  const rows = omit(result, "password");

  return c.json({ total, page, limit, rows }, 200);
};

/**
 * Get authenticated user
 */
export const getUser: RouteHandler<typeof routes.getUser> = async (c) => {
  const user = c.get("user");
  const data = await db.query.users.findFirst({
    where: (t) => eq(t.id, user.id),
  });

  if (!data) {
    throw new APIError("user_not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.json(omit(data, "password"), 200);
};
