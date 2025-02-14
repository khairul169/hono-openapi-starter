import { DB } from "./types.ts";
import { Pool } from "pg";
import { Kysely, PostgresDialect, Transaction } from "kysely";
import env from "@/lib/env";

const conn = new PostgresDialect({
  pool: new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
  }),
});

const db = new Kysely<DB>({
  dialect: conn,
});

export type DBTransaction = Transaction<DB>;

export default db;
