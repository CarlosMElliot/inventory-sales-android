import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
const db = new PGlite();
const session = "00000000-0000-4000-8000-000000000009";
const admin = "00000000-0000-4000-8000-000000000001",
  a = "00000000-0000-4000-8000-000000000002",
  b = "00000000-0000-4000-8000-000000000003",
  op = "00000000-0000-4000-8000-000000000004";
beforeAll(async () => {
  await db.exec(
    `create role anon; create role authenticated; create role service_role bypassrls; create schema auth; create table auth.users(id uuid primary key,email text); create table auth.sessions(id uuid primary key,user_id uuid); create function auth.uid() returns uuid language sql as 'select nullif(current_setting(''request.user'',true),'''')::uuid'; create function auth.jwt() returns jsonb language sql as 'select jsonb_build_object(''iat'',9999999999,''session_id'',current_setting(''request.session'',true))'; grant usage on schema auth,public to authenticated; grant execute on function auth.uid(),auth.jwt() to authenticated; grant usage on schema auth,public to service_role; `,
  );
  await db.exec(
    readFileSync(
      "supabase/migrations/20261003135303_account_foundation.sql",
      "utf8",
    ),
  );
  await db.query("insert into auth.users values ($1,$2),($3,$4),($5,$6)", [
    admin,
    "admin@example.com",
    a,
    "a@example.com",
    b,
    "b@example.com",
  ]);
  await db.query("select public.bootstrap_creator($1,$2)", [admin, "Creator"]);
  await db.query("insert into auth.sessions values($1,$2)", [session, a]);
});
beforeEach(async () => {
  await db.exec("reset role; set role service_role;");
});
afterAll(() => db.close());
describe("database account invariants", () => {
  it("refuses browser RPC calls and role escalation", async () => {
    await db.exec("set role authenticated");
    await expect(
      db.query("select public.bootstrap_creator($1,$2)", [a, "Attack"]),
    ).rejects.toThrow(/permission denied/);
    await db.exec("reset role");
  });
  it("atomically completes one business account and makes retry a no-op", async () => {
    await db.query("select public.reserve_account($1,$2,$3,$4,$5)", [
      admin,
      op,
      "a@example.com",
      "Business A",
      "User A",
    ]);
    await db.query(
      "update public.account_operations set auth_user_id=$1 where id=$2",
      [a, op],
    );
    await db.query("select public.complete_account($1,$2)", [admin, op]);
    await db.query("select public.complete_account($1,$2)", [admin, op]);
    const result = await db.query<{ count: number }>(
      "select count(*)::int as count from public.businesses",
    );
    expect(result.rows[0].count).toBe(1);
  });
  it("rejects idempotency-key reuse with different payload", async () => {
    await expect(
      db.query("select public.reserve_account($1,$2,$3,$4,$5)", [
        admin,
        op,
        "different@example.com",
        "Business B",
        "User B",
      ]),
    ).rejects.toThrow(/request mismatch/);
  });
  it("restricts business reads to the current enabled user", async () => {
    await db.query("select set_config('request.user',$1,false)", [b]);
    await db.exec("set role authenticated");
    expect(
      (await db.query("select * from public.businesses")).rows,
    ).toHaveLength(0);
    await db.exec("reset role");
    await db.query("select set_config('request.user',$1,false)", [a]);
    await db.exec("set role authenticated");
    expect(
      (await db.query("select * from public.businesses")).rows,
    ).toHaveLength(1);
    await expect(
      db.query("update public.app_profiles set role='admin' where id=$1", [a]),
    ).rejects.toThrow(/permission denied/);
    await db.exec("reset role");
  });
  it("disabling access updates audit and prevents business reads", async () => {
    await db.query("select set_config('request.session',$1,false)", [session]);
    await db.query("select public.change_user_access($1,$2,$3,$4,$5)", [
      admin,
      a,
      false,
      "Test restriction",
      false,
    ]);
    await db.exec("set role authenticated");
    expect(
      (await db.query("select * from public.businesses")).rows,
    ).toHaveLength(0);
    await db.exec("reset role");
    expect(
      (
        await db.query(
          "select * from public.admin_events where action='user_disabled'",
        )
      ).rows,
    ).toHaveLength(1);
  });
  it("keeps the revoked session blocked after reactivation and a fresh token timestamp", async () => {
    await db.query("select public.change_user_access($1,$2,$3,$4,$5)", [
      admin,
      a,
      true,
      "Reactivate account",
      false,
    ]);
    await db.exec("set role authenticated");
    expect(
      (await db.query("select * from public.businesses")).rows,
    ).toHaveLength(0);
    await db.exec("reset role");
    expect(
      (await db.query("select * from public.revoked_sessions")).rows,
    ).toHaveLength(1);
  });
  it("protects the creator from ordinary user-management actions", async () => {
    await expect(
      db.query("select public.change_user_access($1,$2,$3,$4,$5)", [
        admin,
        admin,
        false,
        "Wrong target",
        false,
      ]),
    ).rejects.toThrow(/business user required/);
  });
});
