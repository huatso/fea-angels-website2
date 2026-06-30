import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Play } from "lucide-react";
import { sendStartupEmail } from "@/lib/email.server";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/startups")({
  head: () => ({
    meta: [
      { title: "Startups — FEA Angels" },
      { name: "description", content: "Submeta sua startup para a FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/startups" }],
  }),
  component: Startups,
});

function Startups() {
  const [sending, setSending] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/shorts/KJ--nap3q8A");

  useEffect(() => {
    supabase
      .from("page_content")
      .select("content")
      .eq("page", "startups")
      .eq("section", "youtube_url")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setYoutubeUrl(data.content);
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k) as string) || "";
    try {
      await sendStartupEmail({
        data: {
          company: get("company"),
          website: get("website"),
          founder: get("founder"),
          email: get("email"),
          stage: get("stage"),
          sector: get("sector"),
          pitch: get("pitch"),
        },
      });
      toast.success("Submissão recebida! Entraremos em contato em até 3 semanas.");
      form.reset();
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Startups</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">
            Submeta sua startup.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Recebemos submissões continuamente. As mais aderentes à nossa tese são
            convidadas para os próximos Pitch Nights.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        {/* Processo */}
        <div className="grid gap-8 sm:grid-cols-3 mb-20">
          {[
            { n: "01", t: "Submissão", d: "Você envia o formulário com as informações da sua startup." },
            { n: "02", t: "Curadoria", d: "Avaliamos em até 3 semanas. Times com vínculo FEA-USP têm prioridade." },
            { n: "03", t: "Pitch", d: "Selecionados apresentam seu negócio para nossa rede de investidores." },
          ].map((s) => (
            <div key={s.t} className="border-t-2 border-cyan-deep pt-6">
              <p className="nav-label text-cyan-deep font-mono mb-2">{s.n}</p>
              <p className="font-serif text-xl text-ink mb-2">{s.t}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        {/* YouTube */}
        {youtubeUrl && (
          <div className="mb-20 border border-border bg-surface-container-low overflow-hidden">
            <div className="p-8 pb-0">
              <div className="flex items-center gap-2 mb-3">
                <Play className="h-4 w-4 text-cyan-deep" />
                <p className="eyebrow text-cyan-deep before:content-none">Recap — Minerva</p>
              </div>
              <h3 className="font-serif text-2xl text-ink">
                Reviva a energia do nosso último evento.
              </h3>
            </div>
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={youtubeUrl.replace("watch?v=", "embed/").replace("shorts/", "embed/")}
                title="Recap — Minerva | FEA Angels"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl text-ink mb-10">Formulário de submissão</h2>
          <form onSubmit={onSubmit} className="space-y-7">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Nome da startup" name="company" required />
              <Field label="Site" name="website" type="url" placeholder="https://" />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Seu nome" name="founder" required />
              <Field label="E-mail" name="email" type="email" required />
            </div>
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Estágio" name="stage" placeholder="Ideação, MVP, tração inicial, escala..." />
              <Field label="Setor" name="sector" placeholder="Fintech, SaaS, Healthtech..." />
            </div>
            <TextField label="Descreva sua startup (2–3 parágrafos)" name="pitch" required rows={6} />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90 disabled:opacity-60"
            >
              {sending ? "Enviando..." : "Enviar submissão"}
              {!sending && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="nav-label text-muted-foreground block mb-2">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm outline-none transition-colors focus:border-navy placeholder:text-muted-foreground/40"
      />
    </label>
  );
}

function TextField({
  label, name, required, rows = 4,
}: { label: string; name: string; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="nav-label text-muted-foreground block mb-2">{label}{required && " *"}</span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm outline-none transition-colors focus:border-navy resize-none"
      />
    </label>
  );
}
