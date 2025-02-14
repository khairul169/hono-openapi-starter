import * as routes from "./users.routes";
import * as handler from "./users.handler";
import { createRouter } from "..";

export default createRouter()
  .basePath("/users")
  .openapi(routes.list, handler.list)
  .openapi(routes.get, handler.get)
  .openapi(routes.create, handler.create)
  .openapi(routes.update, handler.update)
  .openapi(routes.remove, handler.remove);
