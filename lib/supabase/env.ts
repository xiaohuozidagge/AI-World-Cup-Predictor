/**
 * Supabase environment variable access.
 *
 * Values are read lazily (inside the accessor functions) so that a missing
 * variable never throws during module evaluation — which would otherwise break
 * `next build` for unrelated static pages. Errors name the missing variable but
 * never print its value.
 */

export interface PublicSupabaseEnv {
  url: string
  publishableKey: string
}

export interface AdminSupabaseEnv {
  url: string
  secretKey: string
}

export function getPublicEnv(): PublicSupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase is not configured for public reads. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    )
  }

  return { url, publishableKey }
}

export function getAdminEnv(): AdminSupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const secretKey = process.env.SUPABASE_SECRET_KEY

  if (!url || !secretKey) {
    throw new Error(
      "Supabase is not configured for admin access. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (server only).",
    )
  }

  return { url, secretKey }
}
