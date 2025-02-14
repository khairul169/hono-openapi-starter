import { describe, it, expect } from "bun:test";
import { md5, omit, uuidv4, uuid } from "./utils";
import { z } from "@hono/zod-openapi";

describe("utils", () => {
  it("returns uuid", () => {
    const res = uuid();
    const { success } = z.string().uuid().safeParse(res);
    expect(success).toBeTrue();
  });

  it("returns uuidv4", () => {
    const res = uuidv4();
    const { success } = z.string().uuid().safeParse(res);
    expect(success).toBeTrue();
  });

  it("returns md5 hash", () => {
    const res = md5("example");
    expect(res).toBe("1a79a4d60de6718e8e5b326e338ae533");
  });

  it("returns object with omitted property", () => {
    const object = { username: "test", password: "test123" };
    const res = omit(object, "password");
    expect("password" in res).toBeFalse();
    expect((res as any).password).toBeUndefined();
  });
});
