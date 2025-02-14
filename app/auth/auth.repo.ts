import db from "@/db";
import { User } from "@/db/types";
import env from "@/lib/env";
import * as jwt from "hono/jwt";
import { Selectable } from "kysely";

class AuthRepository {
  async findUser(email: string) {
    return db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();
  }

  async createJwt(user: Pick<Selectable<User>, "id">) {
    return jwt.sign({ id: user.id }, env.JWT_SECRET);
  }
}

export default AuthRepository;
