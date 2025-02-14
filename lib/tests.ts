import { expect } from "bun:test";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createApp } from "@/app";
import auth from "@/app/auth/auth.index";

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

class TestClient<TStoreKeys extends object = any> {
  client!: OpenAPIHono;
  headers: Record<string, string> = {};
  basePath: string = "";
  store: Record<keyof TStoreKeys, any> = {} as never;
  isLoggedIn: boolean = false;

  constructor(route: OpenAPIHono, basePath: string = "") {
    this.client = createApp().route("/", route);
    this.basePath = basePath;
  }

  async fetch(
    method: HTTPMethods = "GET",
    path: string,
    options: Omit<RequestInit, "body"> & {
      query?: Record<string, any>;
      body?: any;
    } = {}
  ) {
    let url = this.basePath + path;
    let body = options?.body;
    const headers: Record<string, string> = {
      ...this.headers,
      ...((options?.headers || {}) as any),
    };

    if (typeof options?.body === "object") {
      body = JSON.stringify(options.body);
      headers["content-type"] = "application/json";
    }

    if (options?.query) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        query.set(key, value);
      }
      if (query.toString()) {
        url += "?" + query;
      }
    }

    const request = { ...options, method, headers, body };
    return this.client.request(url, request);
  }

  async login(email: string = "admin@mail.com", password: string = "123456") {
    const app = createApp().route("/", auth);
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => {});
    if (!res.ok) {
      const message = data?.message || "An error occured";
      throw new Error(message);
    }

    expect(data.token).not.toBeEmpty();
    const headers = { authorization: `Bearer ${data.token}` };
    this.headers["authorization"] = headers.authorization;
    this.isLoggedIn = true;

    return { ...data, headers };
  }

  get<T extends keyof TStoreKeys>(key: T): TStoreKeys[T] {
    return this.store[key];
  }

  set(key: keyof TStoreKeys, value: any) {
    this.store[key] = value;
  }
}

export default TestClient;
