import { JWTUser } from "./lib/types";

declare module "hono" {
  interface ContextVariableMap {
    user: JWTUser;
  }
}
