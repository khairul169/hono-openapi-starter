import { describe, it, expect, beforeAll } from "bun:test";
import TestClient from "@/lib/tests";
import route from "./auth.index";

describe("auth", async () => {
  const client = new TestClient(route, "/auth");

  beforeAll(async () => {
    await client.login();
  });

  it("login successfully", async () => {
    expect(client.isLoggedIn).toBeTrue();
  });

  it("login failed (invalid credentials)", async () => {
    const body = {
      email: "arandommail@email.com",
      password: crypto.randomUUID(),
    };

    const res = await client.fetch("POST", "/login", { body });
    expect(res.status).toBe(401);
    const err = await res.json();
    expect(err.code).toBe("invalid_credentials");
  });

  it("get authenticated user", async () => {
    const res = await client.fetch("GET", "/user");
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.id).toBeTruthy();
    expect(data.email).toBe("admin@mail.com");
  });
});
