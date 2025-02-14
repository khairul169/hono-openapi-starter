import * as routes from "./auth.routes";
import * as handler from "./auth.handler";
import { createRouter } from "@/app/route";

export default createRouter()
  .basePath("/auth")
  .openapi(routes.login, handler.login);
