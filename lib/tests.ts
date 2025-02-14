import { testClient } from "hono/testing";
import createApp from "../app/app";
import auth from "../app/auth/auth.index";

const tests = {
  async login(email: string = "admin@mail.com", password: string = "123456") {
    const app = testClient(createApp().route("/", auth));
    const res = await app.auth.login.$post({ json: { email, password } });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.json();
    return { ...data, headers: { authorization: `Bearer ${data.token}` } };
  },
};

export default tests;
