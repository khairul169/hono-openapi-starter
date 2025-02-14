import { ErrorHandler } from "hono";
import { APIError } from "../lib/types";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "@hono/zod-openapi";
import env from "@/lib/env";

const errorHandler: ErrorHandler = async (err, c) => {
  const res = {
    error: true,
    message: err.message || "An error occured.",
    status: 500,
    code: "internal_error",
  };

  if (err instanceof APIError) {
    res.code = err.code;
  }
  if (err instanceof z.ZodError) {
    res.code = "validation_error";
    res.status = 422;
    const issue = err.issues[0];
    res.message = env.DEV
      ? issue?.path[0] + ": " + issue?.message
      : issue?.message;
  }
  if (err instanceof HTTPException) {
    res.status = err.status;
  }

  return c.json(res, res.status as ContentfulStatusCode);
};

export default errorHandler;
