import { createClient } from "@supabase/supabase-js";

function env(key: string): string {
  if (typeof process !== "undefined" && process.env?.[key]) return process.env[key]!;
  const val = (import.meta.env as any)[key];
  if (val) return val as string;
  throw new Error(`Missing env var: ${key}`);
}

const supabaseUrl = env("VITE_SUPABASE_URL");
const supabaseAnonKey = env("VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
