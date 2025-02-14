import {
  isNull,
  sql,
  count as countSql,
  Subquery,
  SQL,
  and as andSql,
} from "drizzle-orm";
import { PgSelect, timestamp, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "../lib/utils";
import db, { DBSchema } from ".";

export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const timestamps = {
  createdAt,
  updatedAt,
};

export const softDeletes = {
  deletedAt: timestamp(),
};

export const isNotDeleted = (table: any) => isNull(table.deletedAt);

export const uuidPrimaryKey = (columnName: string = "id") =>
  uuid(columnName).primaryKey().notNull().$default(uuidv7);

export const count = async (
  schema: DBSchema | Subquery | SQL
): Promise<number> => {
  const [{ total }] = await db
    .select({ total: countSql() })
    .from(schema as never);
  return total;
};

export const where = (...args: any[]) => andSql(...args.filter(Boolean));
export const and = where;

export const paginate = async <T extends PgSelect>(
  qb: T,
  page: number,
  limit: number
) => {
  const rows = await qb.limit(limit).offset((page - 1) * limit);
  const ids: string[] = rows.map((row: any) => row.id);

  // @ts-ignore
  qb.config.fields = { count: countSql() };
  const [total] = await qb;

  return [rows, total?.count, ids] as const;
};

export const isUniqueConstraintError = (err: unknown) => {
  return (err as Error).message?.includes("unique constraint");
};
