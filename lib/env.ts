import { z } from "@hono/zod-openapi";

const schema = z.object({
  DEV: z.coerce.boolean().default(false),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
});

const env = schema.parse(process.env);

export default env;
