import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { env } from "@/lib/env";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/startups", label: "Startups" },
  { to: "/membros", label: "Membros" },
  { to: "/eventos", label: "Eventos" },
  { to: "/blog", label: "Blog" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 md:px-16">

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          <img
            src="/images/Logo Azul & Azul Escuro.png"
            alt="FEA Angels"
            className="h-14 w-auto dark:hidden"
          />
          <img
            src="/images/Logo FEA Angels - Branca.png"
            alt="FEA Angels"
            className="hidden h-14 w-auto dark:block"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-label text-muted-foreground transition-colors hover:text-navy"
              activeProps={{
                className: "nav-label text-navy border-b-2 border-navy pb-0.5",
              }}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 nav-label text-foreground transition-colors hover:bg-secondary"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Painel
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 nav-label text-foreground transition-colors hover:bg-secondary"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/cadastro"
                className="border-2 border-navy text-navy px-5 py-2 nav-label transition-all hover:bg-navy hover:text-white"
              >
                Quero Investir
              </Link>
              <Link
                to="/startups"
                className="bg-navy text-white px-5 py-2 nav-label transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Receber Investimento
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-navy transition-colors hover:bg-secondary lg:hidden"
          aria-label="Abrir menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-[1280px] flex-col px-5 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 nav-label text-muted-foreground transition-colors hover:text-navy border-b border-border last:border-0"
                activeProps={{ className: "py-3 nav-label text-navy border-b border-border last:border-0" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <div className="mt-4 flex flex-col gap-2 pt-4">
                <Link
                  to="/cadastro"
                  onClick={() => setOpen(false)}
                  className="border-2 border-navy text-navy px-5 py-2.5 nav-label text-center"
                >
                  Quero Investir
                </Link>
                <Link
                  to="/startups"
                  onClick={() => setOpen(false)}
                  className="bg-navy text-white px-5 py-2.5 nav-label text-center"
                >
                  Receber Investimento
                </Link>
              </div>
            )}
            {user && (
              <div className="mt-3 flex gap-2 border-t border-border pt-3">
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-border px-3 py-2 text-center nav-label"
                >
                  Painel
                </Link>
                <button
                  type="button"
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex-1 bg-navy px-3 py-2 text-center nav-label text-white hover:opacity-90"
                >
                  Sair
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      <span className="sr-only">{env.SITE_NAME}</span>
    </header>
  );
}
