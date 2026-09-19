/**
 * Verifies the Supabase connection and that the Phase 2 tables exist.
 *
 * Uses ONLY the publishable key (anon role) — never the secret key — so this
 * script can safely run anywhere. It does not read or print any key values.
 *
 *   npm run db:check
 *
 * Loads .env.local via @next/env so it works outside of `next build`.
 */
import { loadEnvConfig } from "@next/env"

import { getPublicSupabase } from "../lib/supabase/public"

loadEnvConfig(process.cwd())

const PUBLIC_TABLES = ["competitions", "teams", "fixtures"]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasPublishableKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

  if (!url || !hasPublishableKey) {
    console.error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.",
    )
    process.exitCode = 1
    return
  }

  // Log the URL host only — never the key.
  let host = "unknown"
  try {
    host = new URL(url).host
  } catch {
    // keep "unknown"
  }
  console.log(`Supabase host: ${host}`)

  const pub = getPublicSupabase()
  let ok = true

  // 1. Public tables must be readable by the anon role.
  for (const table of PUBLIC_TABLES) {
    const { data, error } = await pub.from(table).select("*").limit(1)
    if (error) {
      ok = false
      console.error(`✗ ${table}: ${error.message}`)
    } else {
      console.log(`✓ ${table}: readable (${data?.length ?? 0} sample row(s))`)
    }
  }

  // 2. data_sync_logs must be INACCESSIBLE to the anon role.
  const logs = await pub.from("data_sync_logs").select("*").limit(1)
  if (logs.error) {
    const msg = logs.error.message ?? ""
    if (/does not exist|schema cache|PGRST205/i.test(msg)) {
      ok = false
      console.error(`✗ data_sync_logs: table not found in public schema (${msg})`)
    } else {
      console.log(`✓ data_sync_logs: blocked for public role (${msg})`)
    }
  } else {
    ok = false
    console.error("✗ data_sync_logs: readable by public role — check GRANT and RLS")
  }

  if (!ok) {
    console.error("\nVerification failed.")
    console.error(
      "If tables are missing, apply the migration (supabase db push or the Dashboard SQL Editor), then reload the PostgREST schema cache.",
    )
    process.exitCode = 1
    return
  }

  console.log("\nSupabase connection and schema verified.")
}

void main()
