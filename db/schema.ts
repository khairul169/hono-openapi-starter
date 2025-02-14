import { boolean, index, pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt, uuidPrimaryKey } from "./utils";

export const users = pgTable(
  "users",
  {
    id: uuidPrimaryKey(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    isActive: boolean().notNull().default(true),
    createdAt,
    updatedAt,
  },
  (t) => [
    //
    index().on(t.email),
    index().on(t.isActive),
  ]
);
