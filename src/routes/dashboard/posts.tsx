import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/posts")({
  head: () => ({
    meta: [
      { title: "Posts — Painel — FEA Angels" },
    ],
  }),
  component: DashboardPosts,
});

type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  read_time: string;
  content: string;
  published: boolean;
  image_url: string;
};

function DashboardPosts() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ slug: "", title: "", excerpt: "", date: "", author: "", category: "", read_time: "", content: "", published: false, image_url: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase.from("posts").select("*").order("id", { ascending: false }).then(({ data, error }) => {
      if (!error && data) setPosts(data as any);
      setLoading(false);
    });
  }, [user]);

  async function handleSave() {
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (editing) {
      const { error } = await supabase.from("posts").update(payload).eq("id", editing.id);
      if (!error) setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p));
    } else {
      const { data, error } = await supabase.from("posts").insert(payload).select().single();
      if (!error && data) setPosts((prev) => [data as any, ...prev]);
    }
    setEditing(null);
    setCreating(false);
    setForm({ slug: "", title: "", excerpt: "", date: "", author: "", category: "", read_time: "", content: "", published: false, image_url: "" });
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  function startEdit(post: PostRow) {
    setEditing(post);
    setCreating(false);
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, date: post.date, author: post.author, category: post.category, read_time: post.read_time, content: post.content, published: post.published, image_url: post.image_url });
  }

  function startCreate() {
    setCreating(true);
    setEditing(null);
    setForm({ slug: "", title: "", excerpt: "", date: "", author: "", category: "", read_time: "", content: "", published: false, image_url: "" });
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
          <h1 className="mt-1 font-serif text-3xl text-ink">Posts</h1>
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
          <h2 className="text-lg font-medium text-ink">{editing ? "Editar post" : "Novo post"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Título</span>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Slug</span>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Data</span>
              <input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Autor</span>
              <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Categoria</span>
              <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Tempo de leitura</span>
              <input value={form.read_time} onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Resumo</span>
              <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-ink">Conteúdo (Markdown)</span>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={10}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink font-mono text-xs transition-colors" />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="rounded border-border" />
              <span className="text-sm font-medium text-ink">Publicado</span>
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
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-400"}`} />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{post.category}</span>
              </div>
              <p className="font-medium text-ink truncate">{post.title}</p>
              <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button type="button" onClick={() => startEdit(post)}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-ink transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => handleDelete(post.id)}
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
