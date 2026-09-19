import type { CronEnv } from "./lib/football-data/cron-sync";

// Omit NEXT_PUBLIC_SUPABASE_URL because wrangler types declares it as a required string (from .env.local).
declare global {
  interface Env extends Omit<CronEnv, "NEXT_PUBLIC_SUPABASE_URL"> {
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
  }
}

export {};
