import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getPublicEnv } from "./env"

let client: SupabaseClient | undefined

/**
 * Public Supabase client (publishable key → `anon` role).
 *
 * Safe to use from Server Components. RLS restricts it to public SELECTs on
 * `competitions` / `teams` / `fixtures` — it cannot insert, update or delete,
 * and it never holds the secret key.
 */
export function getPublicSupabase(): SupabaseClient {
  if (!client) {
    const { url, publishableKey } = getPublicEnv()
    client = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}
