import * as routes from "./users.routes";
import * as handler from "./users.handler";
import { createRouter } from "../app";

export default createRouter()
  .basePath("/users")
  .openapi(routes.getAll, handler.getAll)
  .openapi(routes.create, handler.create)
  .openapi(routes.update, handler.update)
  .openapi(routes.remove, handler.remove);
