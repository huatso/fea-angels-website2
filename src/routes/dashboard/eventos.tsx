import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/eventos")({
  head: () => ({
    meta: [
      { title: "Eventos — Painel — FEA Angels" },
    ],
  }),
  component: DashboardEventos,
});

type EventRow = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: string;
  url: string;
  luma_event_id: string;
};

function DashboardEventos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", location: "", description: "", status: "upcoming", url: "", luma_event_id: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase.from("events").select("*").order("id", { ascending: false }).then(({ data, error }) => {
      if (!error && data) setEvents(data as any);
      setLoading(false);
    });
  }, [user]);

  async function handleSave() {
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      const { error } = await supabase.from("events").update(payload).eq("id", editing.id);
      if (!error) setEvents((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...payload } : e));
    } else {
      const { data, error } = await supabase.from("events").insert(payload).select().single();
      if (!error && data) setEvents((prev) => [data as any, ...prev]);
    }
    setEditing(null);
    setCreating(false);
    setForm({ title: "", date: "", location: "", description: "", status: "upcoming", url: "", luma_event_id: "" });
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function startEdit(event: EventRow) {
    setEditing(event);
    setCreating(false);
    setForm({ title: event.title, date: event.date, location: event.location, description: event.description, status: event.status, url: event.url, luma_event_id: event.luma_event_id });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ title: "", date: "", location: "", description: "", status: "upcoming", url: "", luma_event_id: "" });
  }

  if (authLoading || loading) {
    return <div className="mx-auto max-w-4xl px-6 py-28"><p className="text-sm text-muted-foreground">Carregando...</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao painel
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Gerenciar</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Eventos</h1>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Novo
        </button>
      </div>

      {(creating || editing) && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-6">
          <h2 className="text-lg font-medium text-ink">{editing ? "Editar evento" : "Novo evento"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Título</span>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Data</span>
              <input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Local</span>
              <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Descrição</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Status</span>
              <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors">
                <option value="upcoming">Futuro</option>
                <option value="past">Passado</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">URL</span>
              <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={handleSave}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors">
              Salvar
            </button>
            <button type="button" onClick={() => { setEditing(null); setCreating(false); }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm">
            <div>
              <span className={`text-xs uppercase tracking-wider ${event.status === "upcoming" ? "text-green-600" : "text-muted-foreground"}`}>
                {event.status === "upcoming" ? "Futuro" : "Passado"}
              </span>
              <p className="font-medium text-ink">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.date} · {event.location}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => startEdit(event)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-ink transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => handleDelete(event.id)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
