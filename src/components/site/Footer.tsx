import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { env } from "@/lib/env";
import { sendNewsletterEmail } from "@/lib/email.server";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const socials = [
    { label: "Instagram", url: env.SOCIAL_INSTAGRAM },
    { label: "LinkedIn", url: env.SOCIAL_LINKEDIN },
    { label: "YouTube", url: env.SOCIAL_YOUTUBE },
  ].filter((s) => s.url);

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    try {
      await sendNewsletterEmail({ data: { email } });
      toast.success("Inscrição confirmada! Você receberá novidades por e-mail.");
      setEmail("");
    } catch {
      toast.error("Erro ao inscrever. Tente novamente.");
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="border-t border-border bg-surface-container">
      {/* Main grid */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-16 py-20 md:grid-cols-4">

        {/* Brand */}
        <div className="space-y-4">
          <img src="/images/Logo Azul Escuro.png" alt="FEA Angels" className="h-12 w-auto" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            {env.SITE_DESCRIPTION}
          </p>
          {socials.length > 0 && (
            <div className="flex gap-3 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="nav-label text-muted-foreground transition-colors hover:text-navy"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div>
          <h4 className="nav-label text-navy mb-5">Navegação</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/sobre", label: "Sobre" },
              { to: "/startups", label: "Startups" },
              { to: "/membros", label: "Membros" },
              { to: "/eventos", label: "Eventos" },
              { to: "/blog", label: "Blog" },
              { to: "/politica-de-privacidade", label: "Privacidade" },
              { to: "/login", label: "Acesso" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-navy"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="nav-label text-navy mb-5">Contato</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="leading-relaxed">{env.ADDRESS}</li>
            <li>
              <a
                href={`mailto:${env.CONTACT_EMAIL}`}
                className="transition-colors hover:text-navy"
              >
                {env.CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="nav-label text-navy mb-5">Receba atualizações</h4>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Inscreva-se na FEA News para insights semanais sobre investimento e inovação.
          </p>
          <form onSubmit={onSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-navy placeholder:text-muted-foreground/50"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-navy text-white p-2 transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
              aria-label="Inscrever"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-2 px-5 md:px-16 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {env.SITE_NAME}. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link to="/politica-de-privacidade" className="transition-colors hover:text-navy">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
