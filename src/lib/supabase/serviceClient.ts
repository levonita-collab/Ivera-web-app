import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Server-only. The service role key bypasses Row Level Security entirely —
// this file must NEVER be imported from a "use client" component or any
// code path that ships to the browser.
if (typeof window !== "undefined") {
  throw new Error(
    "src/lib/supabase/serviceClient.ts was imported into browser code. " +
      "The service role key must never reach the client — import " +
      "src/lib/supabase/client.ts instead."
  );
}

let cached: SupabaseClient<Database> | null = null;

/** Returns null (not a throw) if the service role key isn't configured, so
 * callers can degrade gracefully (e.g. return 503) the same way the rest of
 * the app treats an unconfigured Supabase project. */
export function getServiceClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  if (!cached) {
    cached = createClient<Database>(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cached;
}
