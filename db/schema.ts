import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps, uuidPrimaryKey } from "./utils";

export const users = pgTable("users", {
  id: uuidPrimaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  isActive: boolean().notNull().default(true),
  ...timestamps,
});
