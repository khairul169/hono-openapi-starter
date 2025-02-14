import db from "@/db";

class UsersRepository {
  async get(id: string) {
    return db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }
}

export default UsersRepository;
