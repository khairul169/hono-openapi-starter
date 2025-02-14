import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

export class APIError extends HTTPException {
  name: string = "APIError";
  code: string;

  constructor(
    code: string,
    options?: Partial<{ message: string; status: ContentfulStatusCode }>
  ) {
    super(options?.status || 400, { message: options?.message || code });
    this.code = code;
  }
}

export type JWTUser = {
  id: string;
};

export const jsonContent = <T extends z.ZodSchema>(
  schema: T,
  description: string = ""
) => {
  return {
    content: { "application/json": { schema } },
    description,
  };
};

export const errorContent = (
  status: ContentfulStatusCode,
  options?: Partial<{ code: string; message: string; name: string }>
) => {
  const message = options?.message || "An error occured";
  const schema = z.object({
    error: z.boolean().openapi({ example: true }),
    status: z.number().openapi({ example: status }),
    code: z.string().openapi({
      example: options?.code || "internal_error",
    }),
    message: z.string().openapi({
      example: message,
    }),
  });

  return jsonContent(
    options?.name ? schema.openapi(options.name) : schema.openapi("APIError"),
    message
  );
};
