import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./users.routes";
import db from "@/db";
import { eq, ilike } from "drizzle-orm";
import { APIError } from "@/lib/types";
import { omit } from "@/lib/utils";
import { users } from "@/db/schema";
import { and, isUniqueConstraintError, paginate } from "@/db/utils";

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
 * Create new user
 */
export const create: RouteHandler<typeof routes.create> = async (c) => {
  try {
    const data = c.req.valid("json");
    const password = data.password
      ? await Bun.password.hash(data.password)
      : null;

    const [result] = await db
      .insert(users)
      .values({ ...data, password })
      .returning();

    if (!result) {
      throw new APIError("not_found", {
        message: "User not found",
        status: 404,
      });
    }

    return c.json(result, 201);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new APIError("user_exists", {
        message: "Email address already registered",
        status: 400,
      });
    }
    throw err;
  }
};

/**
 * Update user
 */
export const update: RouteHandler<typeof routes.update> = async (c) => {
  try {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const password = data.password
      ? await Bun.password.hash(data.password)
      : undefined;

    const [result] = await db
      .update(users)
      .set({ ...data, password })
      .where(eq(users.id, id))
      .returning();

    if (!result) {
      throw new APIError("not_found", {
        message: "User not found",
        status: 404,
      });
    }

    return c.json(result, 200);
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new APIError("user_exists", {
        message: "Email address already registered",
        status: 400,
      });
    }
    throw err;
  }
};

/**
 * Delete user
 */
export const remove: RouteHandler<typeof routes.remove> = async (c) => {
  const { id } = c.req.valid("param");
  const [result] = await db.delete(users).where(eq(users.id, id)).returning();

  if (!result) {
    throw new APIError("not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.body(null, 204);
};
