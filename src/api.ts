import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL,
  key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const auth = url && key ? createClient(url, key) : null;
export async function api<T>(path: string, body?: unknown): Promise<T> {
  if (!auth)
    throw new Error("Authentication is not configured in this environment.");
  const {
    data: { session },
  } = await auth.auth.getSession();
  if (!session) throw new Error("Please sign in again.");
  const r = await fetch("/api" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await r
    .json()
    .catch(() => ({ error: "The server could not be reached. Please retry." }));
  if (!r.ok) throw new Error(result.error || "Request failed.");
  return result;
}
