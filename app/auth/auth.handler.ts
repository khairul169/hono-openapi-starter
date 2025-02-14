import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./auth.routes";
import db from "@/db";
import { password } from "bun";
import * as jwt from "hono/jwt";
import { md5, omit } from "@/lib/utils";
import { APIError } from "@/lib/types";
import env from "@/lib/env";

/**
 * Login
 */
export const login: RouteHandler<typeof routes.login> = async (c) => {
  const data = c.req.valid("json");
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", data.email)
    .executeTakeFirst();

  try {
    if (!user || !user.password) {
      throw new Error("User not found");
    }

    if (
      !(user.password.length === 32 && user.password === md5(data.password)) &&
      !(await password.verify(data.password, user.password || ""))
    ) {
      throw new Error("Password does not match");
    }
  } catch (err) {
    throw new APIError("invalid_credentials", {
      message: "Username or Password is invalid",
      status: 401,
    });
  }

  if (!user.isActive) {
    throw new APIError("user_inactive", {
      message: "User is inactive",
      status: 403,
    });
  }

  // create auth token
  const token = await jwt.sign({ id: user.id }, env.JWT_SECRET);

  return c.json({ token, user: omit(user, "password") }, 200);
};

/**
 * Get authenticated user
 */
export const getUser: RouteHandler<typeof routes.getUser> = async (c) => {
  const user = c.get("user");
  const data = await db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", user.id)
    .executeTakeFirst();

  if (!data) {
    throw new APIError("user_not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.json(omit(data, "password"), 200);
};
