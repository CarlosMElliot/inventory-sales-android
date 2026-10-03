import { existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
if (existsSync(".env")) process.loadEnvFile(".env");
const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase(),
  url = process.env.SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!email || !url || !key)
  throw new Error(
    "Set BOOTSTRAP_ADMIN_EMAIL, SUPABASE_URL and server key privately in .env.",
  );
if (!process.argv.includes("--confirm"))
  throw new Error(
    "Review the target environment/email, then run npm run bootstrap:admin -- --confirm. This creates an account but sends no email.",
  );
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const existing = await db
  .from("app_profiles")
  .select("id")
  .eq("role", "admin")
  .limit(1);
if (existing.error)
  throw new Error("Account migration is not ready. Apply and verify it first.");
if (existing.data?.length)
  throw new Error(
    "Creator already exists. Use recovery; this command cannot replace an administrator.",
  );
// No public default password; random credential is never printed or retained.
const { data, error } = await db.auth.admin.createUser({
  email,
  password: randomBytes(48).toString("base64url"),
  email_confirm: false,
});
if (error || !data.user)
  throw new Error(
    "Could not create identity. Review existing Auth users privately; never promote an unrelated identity.",
  );
const result = await db.rpc("bootstrap_creator", {
  p_user: data.user.id,
  p_display: "Creator",
});
if (result.error)
  throw new Error(
    "Identity created but role setup failed. Reconcile the Auth identity with the trusted operator procedure; do not create another account.",
  );
console.log(
  "Creator identity provisioned. No email sent and no password displayed. Configure recovery redirects/sender, then request password setup from the login screen.",
);
