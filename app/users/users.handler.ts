import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./users.routes";
import db from "@/db";
import { APIError } from "@/lib/types";
import { omit, uuid } from "@/lib/utils";
import { uniqueError, paginate } from "@/db/utils";

/**
 * List users
 */
export const list: RouteHandler<typeof routes.list> = async (c) => {
  const { page, limit, search, sort, order } = c.req.valid("query");

  const query = db
    .selectFrom("users")
    .selectAll()
    .orderBy(sort, order)
    .$if(!!search, (q) => q.where("email", "ilike", `%${search}%`));

  const [result, total] = await paginate(query, page, limit);
  const rows = omit(result, "password");

  return c.json({ total, page, limit, rows }, 200);
};

/**
 * Get user
 */
export const get: RouteHandler<typeof routes.get> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();

  if (!result) {
    throw new APIError("not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.json(omit(result, "password"), 200);
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

    const result = await db
      .insertInto("users")
      .values({ id: uuid(), ...data, password })
      .returningAll()
      .executeTakeFirstOrThrow();

    return c.json(omit(result, "password"), 201);
  } catch (err) {
    if (uniqueError(err)) {
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

    const result = await db
      .updateTable("users")
      .set({ ...data, password })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    if (!result) {
      throw new APIError("not_found", {
        message: "User not found",
        status: 404,
      });
    }

    return c.json(omit(result, "password"), 200);
  } catch (err) {
    if (uniqueError(err)) {
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
  const result = await db
    .deleteFrom("users")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();

  if (!result) {
    throw new APIError("not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.body(null, 204);
};
