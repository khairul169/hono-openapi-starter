import { password } from "bun";
import db, { DBTransaction } from ".";
import * as schema from "./schema";
import { md5 } from "../lib/utils";

const seeders: Seeder[] = [
  async function users(tx: DBTransaction) {
    const exist = await tx.query.users.findFirst();
    if (exist) return;

    await tx.insert(schema.users).values([
      {
        email: "admin@mail.com",
        password: await password.hash("123456"),
      },
      {
        email: "test@xb.com",
        password: md5("123456"),
      },
    ]);
  },
];

export type Seeder = (t: DBTransaction) => Promise<void>;

const run = async () => {
  console.log("Seeding 🌿...");
  await db.transaction(async (tx) => {
    let idx = 0;
    for (const f of seeders) {
      console.log(`${++idx}. ${f.name}`);
      await f(tx);
    }
  });
  console.log("Finished ✔️");
};

run();
