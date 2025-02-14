import { password } from "bun";
import db, { DBTransaction } from ".";
import { md5, uuid } from "../lib/utils";

const seeders: Seeder[] = [
  async function users(tx: DBTransaction) {
    const exist = await tx.selectFrom("users").select("id").executeTakeFirst();
    if (exist) return;

    await tx
      .insertInto("users")
      .values([
        {
          id: uuid(),
          name: "Admin",
          email: "admin@mail.com",
          password: await password.hash("123456"),
        },
        {
          id: uuid(),
          name: "Test",
          email: "test@xb.com",
          password: md5("123456"),
        },
      ])
      .execute();
  },
];

export type Seeder = (t: DBTransaction) => Promise<void>;

const run = async () => {
  console.log("Seeding 🌿...");

  await db.transaction().execute(async (tx) => {
    let idx = 0;
    for (const f of seeders) {
      console.log(`${++idx}. ${f.name}`);
      await f(tx);
    }
  });

  console.log("Finished ✔️");
  process.exit(0);
};

run();
