import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getAllContent, saveContent } from "@/lib/content";

export const Route = createFileRoute("/dashboard/textos")({
  head: () => ({
    meta: [{ title: "Textos — Painel — FEA Angels" }],
  }),
  component: DashboardTextos,
});

type ContentRow = {
  id: number;
  page: string;
  section: string;
  content: string;
};

const pageLabels: Record<string, string> = {
  home: "Home",
  sobre: "Sobre",
  startups: "Startups",
  contato: "Contato",
  config: "Configurações",
};

const sectionLabels: Record<string, string> = {
  email_to: "E-mail destinatário (testes)",
  video_url: "Recap em vídeo (link do Vimeo ou YouTube)",
  hero_title: "Título do Hero",
  hero_title_highlight: "Destaque no título",
  hero_description: "Descrição do Hero",
  stat_startups: "Nº Startups investidas",
  stat_startups_label: "Label: Startups investidas",
  stat_associados: "Nº Associados",
  stat_associados_label: "Label: Associados",
  stat_valor: "Nº Valor investido",
  stat_valor_label: "Label: Valor investido",
  stat_valor_prefix: "Prefixo do valor",
  stat_valor_suffix: "Sufixo do valor",
  stat_avaliadas: "Nº Startups avaliadas",
  stat_avaliadas_label: "Label: Startups avaliadas",
  slide_0: "Slide 0 (URL da imagem)",
  slide_1: "Slide 1 (URL da imagem)",
  slide_2: "Slide 2 (URL da imagem)",
  slide_3: "Slide 3 (URL da imagem)",

};

function DashboardTextos() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    getAllContent().then((data) => {
      setItems(data as any);
      setLoading(false);
    });
  }, [user]);

  async function handleSave(id: number) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSaving(id);
    await saveContent(id, item.content);
    setSaving(null);
  }

  function updateContent(id: number, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, content: value } : i)));
  }

  async function handleUpload(id: number, file: File) {
    const ext = file.name.split(".").pop();
    const path = `slides/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("images").upload(path, file);
    if (error) { alert("Erro ao enviar: " + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(path);
    updateContent(id, publicUrl);
    setSaving(id);
    await saveContent(id, publicUrl);
    setSaving(null);
  }

  const grouped = items.reduce<Record<string, ContentRow[]>>((acc, item) => {
    (acc[item.page] ??= []).push(item);
    return acc;
  }, {});

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
        <h1 className="mt-1 font-serif text-3xl text-ink">Textos das Páginas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Edite os textos exibidos em cada página do site.</p>
      </div>

      {Object.entries(grouped).map(([page, pageItems]) => (
        <div key={page} className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium mb-4">{pageLabels[page] || page}</h2>
          <div className="space-y-4">
            {pageItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {sectionLabels[item.section] || item.section}
                    </p>
                    {item.section.startsWith("slide_") || item.section.includes("image") || item.section.includes("photo") || item.section.includes("img") ? (
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <input
                            value={item.content}
                            onChange={(e) => updateContent(item.id, e.target.value)}
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink font-mono text-xs transition-colors"
                          />
                          <label className="shrink-0 cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5" />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(item.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                        {item.content && (
                          <img src={item.content} alt="" className="h-24 w-40 rounded-lg border border-border object-cover" />
                        )}
                      </div>
                    ) : item.content.length > 100 ? (
                      <textarea
                        value={item.content}
                        onChange={(e) => updateContent(item.id, e.target.value)}
                        rows={4}
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
                      />
                    ) : (
                      <input
                        value={item.content}
                        onChange={(e) => updateContent(item.id, e.target.value)}
                        className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ink transition-colors"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    disabled={saving === item.id}
                    className="shrink-0 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saving === item.id ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
