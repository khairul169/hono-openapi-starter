import { type RouteHandler } from "@hono/zod-openapi";
import * as routes from "./auth.routes";
import { password } from "bun";
import { md5, omit } from "@/lib/utils";
import { APIError } from "@/lib/types";
import AuthRepository from "./auth.repo";
import UsersRepository from "../users/users.repo";

/**
 * Login
 */
export const login: RouteHandler<typeof routes.login> = async (c) => {
  const repo = new AuthRepository();
  const data = c.req.valid("json");
  const user = await repo.findUser(data.email);

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

  const res = {
    token: await repo.createJwt(user),
    user: omit(user, "password"),
  };

  return c.json(res, 200);
};

/**
 * Get authenticated user
 */
export const getUser: RouteHandler<typeof routes.getUser> = async (c) => {
  const repo = new UsersRepository();
  const user = c.get("user");
  const data = await repo.get(user.id);

  if (!data) {
    throw new APIError("user_not_found", {
      message: "User not found",
      status: 404,
    });
  }

  return c.json(omit(data, "password"), 200);
};
