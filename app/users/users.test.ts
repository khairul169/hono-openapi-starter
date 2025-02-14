import { describe, it, expect } from "bun:test";
import createApp from "../app";
import route from "./users.index";
import { testClient } from "hono/testing";
import tests from "@/lib/tests";

describe("users", async () => {
  const client = testClient(createApp().route("/", route)).users;
  const { headers } = await tests.login();

  it("get authed user", async () => {
    const res = await client.me.$get({}, { headers });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.id).toBeTruthy();
    }
  });

  it("get all users", async () => {
    const res = await client.$get({ query: {} }, { headers });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.rows).toBeArray();
      expect(data.rows[0].id).toBeTruthy();
    }
  });
});
