import * as routes from "./users.routes";
import * as handler from "./users.handler";
import { createRouter } from "@/app/route";

export default createRouter()
  .basePath("/users")
  .openapi(routes.getAll, handler.getAll)
  .openapi(routes.getUser, handler.getUser);
