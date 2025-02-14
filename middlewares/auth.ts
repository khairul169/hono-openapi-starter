import { createMiddleware } from "hono/factory";
import * as jwt from "hono/jwt";
import { APIError, JWTUser } from "../lib/types";

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const token = c.req.header("authorization")?.split(" ")?.[1];
  if (!token) {
    return next();
  }

  try {
    const data = (await jwt.verify(
      token,
      process.env.JWT_SECRET!
    )) as never as JWTUser;

    if (!data) {
      throw new Error("Could not verify token");
    }

    c.set("user", data);
  } catch (err) {
    //
  }

  return next();
});

export const auth = () => {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (!user) {
      throw new APIError("unauthorized", {
        message: "Unauthorized",
        status: 401,
      });
    }

    return next();
  });
};
