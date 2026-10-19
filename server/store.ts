import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { HttpError, type Store, type CreateInput } from "./app";
import type { Profile, Dashboard } from "../src/domain";
function checked<T>(r: { data: T; error: unknown }): T {
  if (r.error)
    throw new HttpError(503, "Data service is unavailable. Please retry.");
  return r.data;
}
export class SupabaseStore implements Store {
  constructor(
    private db: SupabaseClient,
    private origin: string,
  ) {}
  async authenticate(token: string): Promise<Profile> {
    const { data, error } = await this.db.auth.getUser(token);
    if (error || !data.user)
      throw new HttpError(401, "Your session expired. Please sign in.");
    const p = checked(
      await this.db
        .from("app_profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle(),
    );
    if (!p || !p.enabled)
      throw new HttpError(
        403,
        "Account is disabled or has not been provisioned.",
      );
    // Only inspect claims after Auth verified the token.
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    if (
      !Number.isFinite(claims.iat) ||
      claims.iat <= Number(p.sessions_valid_after)
    )
      throw new HttpError(401, "Session revoked. Please sign in again.");
    if (typeof claims.session_id !== "string")
      throw new HttpError(401, "Session identity is missing.");
    const revoked = checked(
      await this.db
        .from("revoked_sessions")
        .select("session_id")
        .eq("session_id", claims.session_id)
        .maybeSingle(),
    );
    if (revoked) throw new HttpError(401, "Session revoked. Sign in again.");
    if (p.role === "business") {
      const b = checked(
        await this.db
          .from("businesses")
          .select("enabled,subscription_status")
          .eq("id", p.business_id)
          .maybeSingle(),
      );
      if (!b || !b.enabled || b.subscription_status === "suspended")
        throw new HttpError(
          403,
          "Business access is suspended. Contact your administrator.",
        );
    }
    if (p.setup_state === "pending" && data.user.last_sign_in_at) {
      checked(
        await this.db
          .from("app_profiles")
          .update({ setup_state: "active" })
          .eq("id", p.id),
      );
      p.setup_state = "active";
    }
    return {
      id: p.id,
      email: p.email,
      display_name: p.display_name,
      role: p.role,
      enabled: p.enabled,
      business_id: p.business_id,
      setup_state: p.setup_state,
    };
  }
  async dashboard(): Promise<Dashboard> {
    const [b, u, e] = await Promise.all([
      this.db
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
      this.db
        .from("app_profiles")
        .select("id,email,display_name,role,enabled,business_id,setup_state")
        .eq("role", "business")
        .order("created_at", { ascending: false })
        .limit(200),
      this.db
        .from("admin_events")
        .select("id,action,reason,created_at,target_id")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    return {
      businesses: checked(b) || [],
      users: checked(u) || [],
      events: checked(e) || [],
    };
  }
  async create(actor: Profile, input: CreateInput) {
    const reserve = await this.db.rpc("reserve_account", {
      p_actor: actor.id,
      p_operation: input.operation_id,
      p_email: input.email,
      p_name: input.business_name,
      p_display: input.display_name,
    });
    if (reserve.error)
      throw new HttpError(
        409,
        "Email or request already exists. Review users or retry the original request.",
      );
    const op = reserve.data as {
      status: string;
      auth_user_id: string | null;
      business_id: string | null;
    };
    if (op.status === "complete")
      return { business_id: op.business_id, user_id: op.auth_user_id };
    if (!op.auth_user_id) {
      const r = await this.db.auth.admin.createUser({
        email: input.email,
        password: randomBytes(48).toString("base64url"),
        email_confirm: false,
        user_metadata: { display_name: input.display_name },
      });
      if (r.error || !r.data.user)
        throw new HttpError(
          409,
          "Auth provisioning needs review. If a previous attempt reached Auth, reconcile its pending operation before retrying.",
        );
      const saved = await this.db
        .from("account_operations")
        .update({ auth_user_id: r.data.user.id })
        .eq("id", input.operation_id)
        .is("auth_user_id", null)
        .select("auth_user_id")
        .single();
      if (saved.error)
        throw new HttpError(
          503,
          "Account setup needs reconciliation. No business access granted.",
        );
      op.auth_user_id = r.data.user.id;
    }
    const r = await this.db.rpc("complete_account", {
      p_actor: actor.id,
      p_operation: input.operation_id,
    });
    if (r.error)
      throw new HttpError(
        503,
        "Account pending completion. Retry the same request.",
      );
    return { business_id: r.data.business_id, user_id: op.auth_user_id };
  }
  async change(
    actor: Profile,
    id: string,
    enabled: boolean | null,
    reason: string,
    revoke: boolean,
  ) {
    const r = await this.db.rpc("change_user_access", {
      p_actor: actor.id,
      p_target: id,
      p_enabled: enabled,
      p_reason: reason,
      p_revoke: revoke,
    });
    if (r.error)
      throw new HttpError(
        409,
        "Only business-user access can be changed here. Refresh and retry.",
      );
  }
  async setup(actor: Profile, id: string) {
    const p = checked(
      await this.db
        .from("app_profiles")
        .select("email,enabled,role")
        .eq("id", id)
        .maybeSingle(),
    );
    if (!p || !p.enabled || p.role !== "business")
      throw new HttpError(409, "Select an enabled business user.");
    checked(
      await this.db
        .from("admin_events")
        .insert({
          actor_id: actor.id,
          target_id: id,
          action: "password_setup_requested",
        }),
    );
    const { error } = await this.db.auth.resetPasswordForEmail(p.email, {
      redirectTo: this.origin + "/auth/set-password",
    });
    checked(
      await this.db
        .from("admin_events")
        .insert({
          actor_id: actor.id,
          target_id: id,
          action: error ? "password_setup_failed" : "password_setup_accepted",
        }),
    );
    if (error)
      throw new HttpError(
        503,
        "Email service rejected the request. Check sender configuration.",
      );
  }
}
export function configuredStore() {
  const url = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key
    ? new SupabaseStore(
        createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        }),
        process.env.APP_ORIGIN || "http://localhost:5173",
      )
    : null;
}
