import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { sendContactEmail, sendNewsletterEmail } from "@/lib/email.server";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — FEA Angels" },
      { name: "description", content: "Entre em contato com a FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/contato" }],
  }),
  component: Contato,
});

function Contato() {
  const [sending, setSending] = useState(false);
  const [newsletter, setNewsletter] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k) as string) || "";
    try {
      await sendContactEmail({
        data: { name: get("name"), email: get("email"), message: get("message") },
      });
      toast.success("Mensagem enviada! Retornaremos em breve.");
      form.reset();
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  async function onNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletter) return;
    setSubscribing(true);
    try {
      await sendNewsletterEmail({ data: { email: newsletter } });
      toast.success("Inscrição confirmada!");
      setNewsletter("");
    } catch {
      toast.error("Erro ao inscrever. Tente novamente.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Contato</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">
            Fale com a gente.
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        <div className="grid gap-20 lg:grid-cols-2">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={onSubmit} className="space-y-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <Field label="Seu nome" name="name" required />
                <Field label="E-mail" name="email" type="email" required />
              </div>
              <TextField label="Mensagem" name="message" required rows={6} />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90 disabled:opacity-60"
              >
                {sending ? "Enviando..." : "Enviar mensagem"}
                {!sending && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>

          {/* Info lateral */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-10"
          >
            <div>
              <p className="eyebrow mb-4">Onde estamos</p>
              <div className="flex gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-navy" />
                <p className="text-sm leading-relaxed">
                  Av. Prof. Luciano Gualberto, 908 — sala C-13
                  <br />
                  FEA-USP, São Paulo – SP, 05508-010
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">E-mail</p>
              <a
                href="mailto:contato@feaangels.com.br"
                className="flex gap-3 text-muted-foreground hover:text-navy transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="text-sm">contato@feaangels.com.br</span>
              </a>
            </div>

            <div>
              <p className="eyebrow mb-4">Redes sociais</p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/feaangels"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-navy hover:text-navy"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/company/feaangels"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-navy hover:text-navy"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter — fundo navy */}
      <div className="bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-20">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <div className="eyebrow text-white/60 mb-4 before:bg-white/40">Newsletter</div>
              <h2 className="font-serif text-3xl text-white lg:text-4xl">
                Receba novidades da rede.
              </h2>
              <p className="mt-3 text-white/70 max-w-md leading-relaxed">
                Acompanhe eventos, análises de mercado e oportunidades de investimento
                diretamente na sua caixa de entrada.
              </p>
            </div>
            <form onSubmit={onNewsletter} className="flex gap-3 max-w-md">
              <input
                type="email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                placeholder="seu@email.com"
                required
                className="flex-1 border-b border-white/30 bg-transparent px-0 py-2.5 text-sm text-white outline-none transition-colors focus:border-white placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="inline-flex items-center gap-1.5 bg-white text-navy px-6 py-2.5 nav-label transition-all hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              >
                {subscribing ? "Enviando..." : "Inscrever"}
                {!subscribing && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", required,
}: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="nav-label text-muted-foreground block mb-2">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border-b border-border bg-transparent px-0 py-2.5 text-sm outline-none transition-colors focus:border-navy"
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
