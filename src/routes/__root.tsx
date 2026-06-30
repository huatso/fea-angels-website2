import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-navy">404</h1>
        <h2 className="mt-4 text-xl font-medium">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">Algo deu errado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy/90"
          >
            Tentar de novo
          </button>
          <a href="/" className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FEA Angels — Investimento anjo USP" },
      { name: "description", content: "Rede de investidores-anjo formada por ex-alunos da FEA-USP. Mais de R$ 5M investidos em 50+ startups desde 2018." },
      { name: "keywords", content: "FEA Angels, investimento anjo, FEA-USP, startups, venture capital, investidores, empreendedorismo" },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "pt-BR" },
      { property: "og:title", content: "FEA Angels — Rede de Investimento Anjo da FEA-USP" },
      { property: "og:description", content: "Transformando o empreendedorismo brasileiro por meio do investimento anjo. +100 investidores, +50 startups investidas, +R$ 5M investidos." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://feaangels.com.br" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "FEA Angels" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FEA Angels — Rede de Investimento Anjo da FEA-USP" },
      { name: "twitter:description", content: "Transformando o empreendedorismo brasileiro por meio do investimento anjo." },
    ],
    links: [
      { rel: "canonical", href: "https://feaangels.com.br" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "FEA Angels",
          url: "https://feaangels.com.br",
          logo: "https://feaangels.com.br/images/Logo%20Azul%20&%20Azul%20Escuro.png",
          description: "Rede de investidores-anjo formada por ex-alunos da FEA-USP.",
          email: "contato@feaangels.com.br",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Prof. Luciano Gualberto, 908",
            addressLocality: "São Paulo",
            addressRegion: "SP",
            addressCountry: "BR",
          },
          sameAs: [
            "https://instagram.com/feaangels",
            "https://linkedin.com/company/feaangels",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
