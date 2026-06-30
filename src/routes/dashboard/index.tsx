import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Users, Calendar, FileText, FileEdit, Briefcase, HelpCircle, MessageSquareText, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Painel — FEA Angels" },
      { name: "description", content: "Painel de administração da FEA Angels." },
    ],
  }),
  component: DashboardHome,
});

const sections = [
  { to: "/dashboard/membros", label: "Membros", desc: "Gerenciar membros da rede", icon: Users },
  { to: "/dashboard/eventos", label: "Eventos", desc: "Gerenciar eventos", icon: Calendar },
  { to: "/dashboard/posts", label: "Posts", desc: "Gerenciar blog", icon: FileText },
  { to: "/dashboard/textos", label: "Textos", desc: "Editar textos das páginas", icon: FileEdit },
  { to: "/dashboard/portfolio", label: "Portfólio", desc: "Gerenciar portfólio de startups", icon: Briefcase },
  { to: "/dashboard/faq", label: "FAQ", desc: "Gerenciar perguntas frequentes", icon: HelpCircle },
  { to: "/dashboard/depoimentos", label: "Depoimentos", desc: "Gerenciar depoimentos da home", icon: MessageSquareText },
  { to: "/dashboard/newsletter", label: "Newsletter", desc: "Visualizar inscritos da newsletter", icon: Mail },
];

function DashboardHome() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-28">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Admin</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Painel de Controle</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Gerencie os conteúdos do site FEA Angels.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-cyan-deep/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-deep/10 text-cyan-deep">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-medium text-ink">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-cyan-deep opacity-0 transition-opacity group-hover:opacity-100">
              Gerenciar <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
