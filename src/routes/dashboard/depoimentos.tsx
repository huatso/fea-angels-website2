import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Testimonial } from "@/data/testimonials";

export const Route = createFileRoute("/dashboard/depoimentos")({
  head: () => ({
    meta: [{ title: "Depoimentos — Painel — FEA Angels" }],
  }),
  component: DashboardDepoimentos,
});

const emptyForm = { quote: "", name: "", role: "", company: "", type: "investor" as "investor" | "founder", sort_order: 0 };

function DashboardDepoimentos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => {
      if (data) setItems(data as any);
      setLoading(false);
    });
  }, [user]);

  async function handleSave() {
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      await supabase.from("testimonials").update(payload).eq("id", editing.id);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...payload } : i));
    } else {
      const { data } = await supabase.from("testimonials").insert(payload).select().single();
      if (data) setItems((prev) => [...prev, data as any]);
    }
    setEditing(null);
    setCreating(false);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: Testimonial) {
    setEditing(item);
    setCreating(false);
    setForm({ quote: item.quote, name: item.name, role: item.role, company: item.company, type: item.type, sort_order: item.sort_order });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ ...emptyForm, sort_order: items.length });
  }

  if (authLoading || loading) {
    return <div className="mx-auto max-w-4xl px-6 py-28"><p className="text-sm text-muted-foreground">Carregando...</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao painel
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Gerenciar</p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Depoimentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Depoimentos exibidos na home.</p>
        </div>
        {!creating && !editing && (
          <button type="button" onClick={startCreate}
            className="inline-flex items-center gap-1 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors">
            <Plus className="h-4 w-4" /> Novo depoimento
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-6">
          <h2 className="text-lg font-medium text-ink">{editing ? "Editar depoimento" : "Novo depoimento"}</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Nome</span>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Cargo</span>
              <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Empresa / Descrição</span>
              <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Tipo</span>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "investor" | "founder" }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors">
                <option value="investor">Investidor(a)</option>
                <option value="founder">Fundador(a)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Ordem</span>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className="mt-1 w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Depoimento</span>
              <textarea value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} rows={4}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
          </div>
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={handleSave}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors">Salvar</button>
            <button type="button" onClick={() => { setEditing(null); setCreating(false); }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">Cancelar</button>
          </div>
        </div>
      )}

      <div className="mt-10 space-y-3">
        {items.length === 0 && !creating && (
          <p className="text-sm text-muted-foreground">Nenhum depoimento cadastrado.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink text-sm">{item.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.type === "investor" ? "bg-navy/10 text-navy" : "bg-cyan-deep/10 text-cyan-deep"
                  }`}>
                    {item.type === "investor" ? "Investidor(a)" : "Fundador(a)"}
                  </span>
                </div>
                {(item.role || item.company) && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.role}{item.role && item.company ? " — " : ""}{item.company}</p>
                )}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">&ldquo;{item.quote}&rdquo;</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => startEdit(item)}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-ink transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => handleDelete(item.id)}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
