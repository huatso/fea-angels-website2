import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Mail } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/newsletter")({
  head: () => ({
    meta: [{ title: "Newsletter — Painel — FEA Angels" }],
  }),
  component: DashboardNewsletter,
});

type Subscriber = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

function DashboardNewsletter() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setSubscribers((data ?? []) as Subscriber[]);
        setLoading(false);
      });
  }, [user]);

  async function handleDelete(id: number) {
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
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
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Newsletter</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">Inscritos</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subscribers.length} inscrito(s) no total.</p>
      </div>

      {subscribers.length === 0 ? (
        <p className="mt-12 text-sm text-muted-foreground">Nenhum inscrito ainda.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-deep/10 text-cyan-deep">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{s.name || "(sem nome)"}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString("pt-BR")}
                </span>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
