import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Accept the new Supabase publishable key (sb_publishable_…) and fall back to
// the legacy anon key, so either env var works during the key migration.
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient<Database> | null =
  url && key ? createClient<Database>(url, key) : null;

export const isSupabaseAvailable = supabase !== null;
