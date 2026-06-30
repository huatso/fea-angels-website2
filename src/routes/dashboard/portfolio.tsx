import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import {
  getPortfolio,
  savePortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/lib/content";
import type { PortfolioItem } from "@/lib/content";

export const Route = createFileRoute("/dashboard/portfolio")({
  head: () => ({
    meta: [{ title: "Portfólio — Painel — FEA Angels" }],
  }),
  component: DashboardPortfolio,
});

function DashboardPortfolio() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sector: "",
    stage: "",
    year: new Date().getFullYear(),
    logo_url: "",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    getPortfolio().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [user]);

  async function handleUpload(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `portfolio/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) {
      return null;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(path);
    return publicUrl;
  }

  async function handleSave() {
    const payload = { ...form, year: Number(form.year) };
    if (editing) {
      const { error } = await updatePortfolioItem(editing.id, payload);
      if (!error)
        setItems((prev) => prev.map((i) => (i.id === editing.id ? { ...i, ...payload } : i)));
    } else {
      const { data, error } = await savePortfolioItem(payload);
      if (!error && data) setItems((prev) => [...prev, data as any]);
    }
    setEditing(null);
    setCreating(false);
    setForm({ name: "", sector: "", stage: "", year: new Date().getFullYear(), logo_url: "" });
  }

  async function handleDelete(id: number) {
    const { error } = await deletePortfolioItem(id);
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: PortfolioItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      name: item.name,
      sector: item.sector,
      stage: item.stage,
      year: item.year,
      logo_url: item.logo_url ?? "",
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ name: "", sector: "", stage: "", year: new Date().getFullYear(), logo_url: "" });
  }

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao painel
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">
            Gerenciar
          </p>
          <h1 className="mt-1 font-serif text-3xl text-ink">Portfólio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Startups do portfólio exibidas na home.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova
        </button>
      </div>

      {(creating || editing) && (
        <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-6">
          <h2 className="text-lg font-medium text-ink">
            {editing ? "Editar startup" : "Nova startup"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-ink">Nome</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Setor</span>
              <input
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Estágio</span>
              <input
                value={form.stage}
                onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Ano</span>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Logo</span>
              <div className="mt-1 flex items-center gap-4">
                {form.logo_url && (
                  <img
                    src={form.logo_url}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover border border-border"
                  />
                )}
                <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5">
                  <Upload className="h-4 w-4" />
                  {form.logo_url ? "Trocar logo" : "Fazer upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleUpload(file);
                        if (url) setForm((f) => ({ ...f, logo_url: url }));
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <input
                  value={form.logo_url}
                  onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                  placeholder="Ou cole uma URL..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
                />
              </div>
            </label>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setCreating(false);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10 font-serif text-lg font-semibold text-navy overflow-hidden">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    item.name[0]
                  )}
                </div>
                <p className="mt-3 font-semibold text-ink text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.sector}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    {item.stage}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.year}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-ink transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                >
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
