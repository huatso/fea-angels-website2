import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Blog — FEA Angels" },
      { name: "description", content: "Artigo do blog da FEA Angels." },
    ],
    links: [{ rel: "canonical", href: `https://feaangels.com.br/blog/${params.slug}` }],
  }),
  component: BlogPost,
});

type Post = {
  title: string;
  content: string;
  excerpt: string;
  cover_url: string | null;
  author: string;
  published_at: string;
  category: string | null;
};

function BlogPost() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("title,content,excerpt,cover_url,author,published_at,category")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setPost(data as any);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="font-serif text-2xl text-navy">Artigo não encontrado.</p>
        <Link
          to="/blog"
          className="nav-label text-cyan-deep flex items-center gap-1 hover:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {post.cover_url && (
        <div className="h-[480px] w-full overflow-hidden bg-surface-container">
          <img src={post.cover_url} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-[720px] px-5 md:px-8 py-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 nav-label text-muted-foreground hover:text-navy transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" /> Blog
        </Link>

        <div className="mb-12">
          {post.category && <div className="eyebrow mb-4">{post.category}</div>}
          <h1 className="font-serif text-4xl leading-tight text-navy lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 border-b border-border pb-8">
            <div className="flex h-9 w-9 items-center justify-center bg-surface-container-low border border-border">
              <span className="text-xs font-semibold text-muted-foreground">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{post.author}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.published_at).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div
          className="prose prose-neutral prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-navy
            prose-a:text-cyan-deep prose-a:underline-offset-4
            prose-strong:text-ink"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
