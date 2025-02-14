import { drizzle } from "drizzle-orm/bun-sql";
import { SQL } from "bun";
import * as schema from "./schema";
import { count } from "./utils";
import env from "@/lib/env";

const client = new SQL(env.DATABASE_URL);
const instance = drizzle({ client, schema });

export type DatabaseType = typeof db;
export type DBTransaction = Parameters<
  Parameters<DatabaseType["transaction"]>[0]
>[0];

const db = Object.assign(instance, { schema, count });

export { schema };
export type DBSchema = (typeof schema)[keyof typeof schema];
export default db;
