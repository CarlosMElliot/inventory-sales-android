import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { makeApp, HttpError, type Store } from "../server/app";
const admin = {
  id: "ad",
  email: "admin@example.com",
  display_name: "Admin",
  role: "admin" as const,
  enabled: true,
  business_id: null,
  setup_state: "active",
};
const store: Store = {
  authenticate: vi.fn(async (token) => {
    if (token === "bad") throw new HttpError(401, "Invalid session");
    return token === "admin"
      ? admin
      : { ...admin, role: "business" as const, business_id: "biz" };
  }),
  dashboard: vi.fn(async () => ({ businesses: [], users: [], events: [] })),
  create: vi.fn(async () => ({})),
  change: vi.fn(async () => {}),
  setup: vi.fn(async () => {}),
};
describe("server authorization", () => {
  it("requires a verified bearer session", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173")).get(
          "/api/admin/dashboard",
        )
      ).status,
    ).toBe(401);
  });
  it("denies business users even at known admin routes", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173"))
          .get("/api/admin/dashboard")
          .set("Authorization", "Bearer business")
      ).status,
    ).toBe(403);
  });
  it("rejects invalid auth without leaking provider details", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173"))
          .get("/api/me")
          .set("Authorization", "Bearer bad")
      ).status,
    ).toBe(401);
  });
  it("allows verified administrators", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173"))
          .get("/api/admin/dashboard")
          .set("Authorization", "Bearer admin")
      ).status,
    ).toBe(200);
  });
  it("rejects forged roles in creation body", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173"))
          .post("/api/admin/accounts")
          .set("Authorization", "Bearer admin")
          .send({
            operation_id: crypto.randomUUID(),
            business_name: "Test Store",
            display_name: "Test User",
            email: "user@example.com",
            role: "admin",
          })
      ).status,
    ).toBe(400);
  });
  it("fails closed when not configured", async () => {
    expect(
      (await request(makeApp(null, "http://localhost:5173")).get("/api/me"))
        .status,
    ).toBe(503);
  });
  it("rejects foreign-origin mutations", async () => {
    expect(
      (
        await request(makeApp(store, "http://localhost:5173"))
          .post("/api/admin/accounts")
          .set("Authorization", "Bearer admin")
          .set("Origin", "https://evil.example")
          .send({})
      ).status,
    ).toBe(403);
  });
});
