import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getAdminEnv } from "./env"

let client: SupabaseClient | undefined

/**
 * Admin Supabase client (secret key → `service_role`, bypasses RLS).
 *
 * SERVER ONLY. Import exclusively from server-only modules (background sync
 * tasks). The secret key is never exposed to the browser. The `import
 * "server-only"` guard is intentionally omitted so Wrangler's esbuild can
 * bundle this module for the Cloudflare cron handler; callers are server code
 * (background sync scripts, the cron entry) and never a Client Component.
 */
export function getAdminSupabase(): SupabaseClient {
  if (!client) {
    const { url, secretKey } = getAdminEnv()
    client = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}
