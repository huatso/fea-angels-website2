import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import type { Member } from "@/data/members";

export const Route = createFileRoute("/dashboard/membros")({
  head: () => ({
    meta: [{ title: "Membros — Painel — FEA Angels" }],
  }),
  component: DashboardMembros,
});

function DashboardMembros() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<(Member & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Member & { id: number }) | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    initials: "",
    photo_url: "",
    category: "conselho",
  });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("members")
      .select("*")
      .order("id")
      .then(({ data, error }) => {
        if (!error && data) setMembers(data as any);
        setLoading(false);
      });
  }, [user]);

  async function handleUpload(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `members/${Date.now()}.${ext}`;
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
    const payload: Record<string, any> = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      const { error } = await supabase.from("members").update(payload).eq("id", editing.id);
      if (!error)
        setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...payload } : m)));
    } else {
      const { data, error } = await supabase.from("members").insert(payload).select().single();
      if (!error && data) setMembers((prev) => [...prev, data as any]);
    }
    setEditing(null);
    setCreating(false);
    setForm({ name: "", role: "", bio: "", initials: "", photo_url: "", category: "conselho" });
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function startEdit(member: Member & { id: number }) {
    setEditing(member);
    setCreating(false);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      initials: member.initials,
      photo_url: member.photo_url ?? "",
      category: member.category,
    });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ name: "", role: "", bio: "", initials: "", photo_url: "", category: "conselho" });
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
          <h1 className="mt-1 font-serif text-3xl text-ink">Membros</h1>
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
          <h2 className="text-lg font-medium text-ink">
            {editing ? "Editar membro" : "Novo membro"}
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
              <span className="text-sm font-medium text-ink">Cargo</span>
              <input
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Bio</span>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Iniciais</span>
              <input
                value={form.initials}
                onChange={(e) => setForm((f) => ({ ...f, initials: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Categoria</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
              >
                <option value="conselho">Conselho</option>
                <option value="diretoria">Diretoria</option>
                <option value="estagiarios">Estagiários</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Foto de perfil</span>
              <div className="mt-1 flex items-center gap-4">
                {form.photo_url && (
                  <img
                    src={form.photo_url}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover border border-border"
                  />
                )}
                <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5">
                  <Upload className="h-4 w-4" />
                  {form.photo_url ? "Trocar foto" : "Fazer upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleUpload(file);
                        if (url) setForm((f) => ({ ...f, photo_url: url }));
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <input
                  value={form.photo_url}
                  onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))}
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

      <div className="mt-8 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm"
          >
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {member.category}
              </span>
              <p className="font-medium text-ink">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(member)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-ink transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(member.id)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
