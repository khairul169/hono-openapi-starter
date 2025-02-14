import auth from "./auth/auth.index";
import users from "./users/users.index";

const routes = [
  auth,
  users,
  //
] as const;

export default routes;
