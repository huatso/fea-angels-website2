import { createClient } from "@supabase/supabase-js";

function env(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) return process.env[key]!;
  const val = (import.meta.env as any)[key];
  if (val) return val as string;
  return undefined;
}

const supabaseUrl = env("VITE_SUPABASE_URL");
const supabaseAnonKey = env("VITE_SUPABASE_ANON_KEY");

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : undefined;

export function getSupabase() {
  if (!supabase) {
    throw new Error("Missing env var: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  return supabase;
}
