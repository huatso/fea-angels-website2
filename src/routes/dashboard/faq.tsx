import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/faq")({
  head: () => ({
    meta: [{ title: "FAQ — Painel — FEA Angels" }],
  }),
  component: DashboardFaq,
});

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
};

function DashboardFaq() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ category: "investors", question: "", answer: "", sort_order: 0 });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase.from("faq").select("*").order("category").order("sort_order").then(({ data }) => {
      if (data) setItems(data as any);
      setLoading(false);
    });
  }, [user]);

  async function handleSave() {
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      await supabase.from("faq").update(payload).eq("id", editing.id);
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...payload } : i));
    } else {
      const { data } = await supabase.from("faq").insert(payload).select().single();
      if (data) setItems((prev) => [...prev, data as any]);
    }
    setEditing(null);
    setCreating(false);
    setForm({ category: "investors", question: "", answer: "", sort_order: 0 });
  }

  async function handleDelete(id: number) {
    await supabase.from("faq").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: FaqItem) {
    setEditing(item);
    setCreating(false);
    setForm({ category: item.category, question: item.question, answer: item.answer, sort_order: item.sort_order });
  }

  function startCreate(cat: string) {
    setCreating(true);
    setEditing(null);
    setForm({ category: cat, question: "", answer: "", sort_order: items.filter((i) => i.category === cat).length });
  }

  if (authLoading || loading) {
    return <div className="mx-auto max-w-4xl px-6 py-28"><p className="text-sm text-muted-foreground">Carregando...</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao painel
      </Link>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Gerenciar</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">FAQ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Perguntas frequentes da home.</p>
      </div>

      {(creating || editing) && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-6">
          <h2 className="text-lg font-medium text-ink">{editing ? "Editar pergunta" : "Nova pergunta"}</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Categoria</span>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors">
                <option value="investors">Investidores</option>
                <option value="startups">Startups</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Pergunta</span>
              <input value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Resposta</span>
              <textarea value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Ordem</span>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className="mt-1 w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
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

      {["investors", "startups"].map((cat) => {
        const group = items.filter((i) => i.category === cat);
        return (
          <div key={cat} className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">
                {cat === "investors" ? "Para Investidores" : "Para Startups"}
              </h2>
              <button type="button" onClick={() => startCreate(cat)}
                className="inline-flex items-center gap-1 text-sm text-cyan-deep hover:text-cyan-deep/70 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {group.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-ink text-sm">{item.question}</p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
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
      })}
    </div>
  );
}
