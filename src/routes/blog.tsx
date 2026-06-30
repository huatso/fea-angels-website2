import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — FEA Angels" },
      {
        name: "description",
        content: "Artigos, análises e insights do ecossistema de investimento anjo do Brasil.",
      },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/blog" }],
  }),
  component: BlogLayout,
});

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  author: string;
  published_at: string;
  category: string | null;
};

function BlogLayout() {
  const routerState = useRouterState();
  const isIndex =
    routerState.location.pathname === "/blog" ||
    routerState.location.pathname === "/blog/";
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("slug,title,excerpt,cover_url,author,published_at,category")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data as any);
      });
  }, []);

  if (!isIndex) return <Outlet />;

  const [featured, ...rest] = posts;

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Blog</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">
            Insights & análises.
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        {/* Artigo em destaque */}
        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group mb-16 block border border-border bg-card soft-lift overflow-hidden"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-between">
                <div>
                  <p className="eyebrow mb-4">{featured.category || "Destaque"}</p>
                  <h2 className="font-serif text-3xl text-navy group-hover:text-cyan-deep transition-colors leading-snug lg:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-3">
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <div>
                    <p className="text-sm font-semibold text-ink">{featured.author}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(featured.published_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-navy group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              {featured.cover_url && (
                <div className="order-first lg:order-last bg-surface-container min-h-60 overflow-hidden">
                  <img
                    src={featured.cover_url}
                    alt={featured.title}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Grade de artigos */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group border border-border bg-card soft-lift overflow-hidden block"
              >
                {post.cover_url && (
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="nav-label text-cyan-deep text-xs">{post.category}</span>
                  )}
                  <h2 className="mt-2 font-serif text-xl text-ink group-hover:text-navy transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>
                      {new Date(post.published_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum artigo publicado ainda.</p>
        )}
      </div>
    </div>
  );
}
