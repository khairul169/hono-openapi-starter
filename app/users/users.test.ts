import { describe, it, expect, beforeAll } from "bun:test";
import createApp from "../app";
import route from "./users.index";
import { testClient } from "hono/testing";
import tests from "@/lib/tests";
import { faker } from "@faker-js/faker";

describe("users", async () => {
  const client = testClient(createApp().route("/", route)).users;
  const { headers } = await tests.login();
  let id = "";

  // create user
  beforeAll(async () => {
    const json = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const res = await client.$post({ json }, { headers });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.id).toBeTruthy();
      expect(data.email).toBe(json.email);
      id = data.id;
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

  it("create user", async () => {
    expect(id).not.toBeEmpty();
  });

  it("update user", async () => {
    expect(id).not.toBeEmpty();

    const json = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: false,
    };
    const res = await client[":id"].$put({ param: { id }, json }, { headers });
    expect(res.ok).toBe(true);

    if (res.ok) {
      const data = await res.json();
      expect(data.id).toBeTruthy();
      expect(data.email).toBe(json.email);
      expect(data.isActive).toBe(json.isActive);
    }
  });

  it("delete user", async () => {
    expect(id).not.toBeEmpty();
    const res = await client[":id"].$delete({ param: { id } }, { headers });
    expect(res.ok).toBe(true);
  });
});
