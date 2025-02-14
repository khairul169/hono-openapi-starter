import { describe, it, expect, beforeAll } from "bun:test";
import { faker } from "@faker-js/faker";
import TestClient from "@/lib/tests";
import route from "./users.index";

describe("users", async () => {
  const client = new TestClient<{ id: string }>(route, "/users");

  beforeAll(async () => {
    await client.login();

    // create new user
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const res = await client.fetch("POST", "/", { body });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.email).toBe(body.email);
    client.set("id", data.id);
  });

  it("get all users", async () => {
    const res = await client.fetch("GET", "/");
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.rows).toBeArray();
    expect(data.rows[0].id).toBeTruthy();
  });

  it("create user", async () => {
    const id = client.get("id");
    expect(id).not.toBeEmpty();
  });

  it("update user", async () => {
    const id = client.get("id");
    expect(id).not.toBeEmpty();

    const body = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      isActive: false,
    };
    const res = await client.fetch("PUT", `/${id}`, { body });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.email).toBe(body.email);
    expect(data.isActive).toBe(body.isActive);
  });

  it("delete user", async () => {
    const id = client.get("id");
    expect(id).not.toBeEmpty();
    const res = await client.fetch("DELETE", `/${id}`);
    expect(res.ok).toBe(true);
  });
});
