import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function env(key: string): string {
  const val = process.env[key];
  if (val) return val;
  throw new Error(`Missing env var: ${key}`);
}

const supabaseUrl = env("VITE_SUPABASE_URL");
const supabaseAnonKey = env("VITE_SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: "upcoming" | "past";
  url: string | null;
  luma_event_id: string | null;
};

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await supabase.from("events").select("*").order("id", { ascending: false });
  return (data ?? []) satisfies Event[];
});

/**
 * Filtro conveniente — reuso nos loaders das rotas.
 */
export function getUpcoming(events: Event[]) {
  return events.filter((e) => e.status === "upcoming");
}

export function getPast(events: Event[]) {
  return events.filter((e) => e.status === "past");
}
