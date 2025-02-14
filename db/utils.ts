import { SelectQueryBuilder } from "kysely";
import { DB } from "./types";

export const count = async <O>(
  qb: SelectQueryBuilder<DB, keyof DB, O>
): Promise<number> => {
  const result = await qb
    .clearSelect()
    .clearOrderBy()
    .select((eb) => [eb.fn.countAll<number>().as("count")])
    .executeTakeFirstOrThrow();
  return Number(result?.count || 0);
};

export const paginate = async <O>(
  qb: SelectQueryBuilder<DB, keyof DB, O>,
  page: number,
  limit: number
) => {
  let ids: string[] = [];

  const [total, rows] = await Promise.all([
    count(qb),
    qb
      .offset(Math.max(0, (page - 1) * limit))
      .limit(limit)
      .execute(),
  ]);

  if (rows.length > 0 && "id" in rows[0]) {
    ids = rows.map((row: any) => row.id);
  }

  return [rows, total, ids] as const;
};

export const uniqueError = (err: unknown) => {
  return (err as Error).message?.includes("unique constraint");
};
