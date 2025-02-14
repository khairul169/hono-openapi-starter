import { describe, it, expect } from "bun:test";
import createApp from "../app";
import route from "./auth.index";
import { testClient } from "hono/testing";

describe("auth", async () => {
  const client = testClient(createApp().route("/", route)).auth;
  let token = "";

  it("login successfully", async () => {
    const res = await client.login.$post({
      json: {
        email: "admin@mail.com",
        password: "123456",
      },
    });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.token).not.toBeEmpty();
      expect(data.user.id).toBeTruthy();
      token = data.token;
    }
  });

  it("login failed (invalid credentials)", async () => {
    const res = await client.login.$post({
      json: {
        email: "arandommail@email.com",
        password: crypto.randomUUID(),
      },
    });
    expect(res.ok).toBe(false);
    expect(res.status).toBe(401);
    const err = await res.json();
    expect((err as any).code).toBe("invalid_credentials");
  });

  it("get authenticated user", async () => {
    const headers = { authorization: `Bearer ${token}` };
    const res = await client.user.$get({}, { headers });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.id).toBeTruthy();
      expect(data.email).toBe("admin@mail.com");
    }
  });
});
