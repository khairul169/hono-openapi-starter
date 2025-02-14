import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./auth.routes";
import db from "@/db";
import { and, eq } from "drizzle-orm";
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
  const user = await db.query.users.findFirst({
    where: (t) => and(eq(t.email, data.email)),
  });

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
