import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FlipCard } from "@/components/ui/FlipCard";

export const Route = createFileRoute("/membros")({
  head: () => ({
    meta: [
      { title: "Membros — FEA Angels" },
      { name: "description", content: "Conheça os investidores anjo da rede FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/membros" }],
  }),
  component: Membros,
});

type MemberRow = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  photo_url?: string;
  category: "conselho" | "diretoria" | "estagiarios";
};

const sections = [
  { key: "conselho" as const, title: "Conselho de Administração" },
  { key: "diretoria" as const, title: "Diretoria Executiva" },
  { key: "estagiarios" as const, title: "Estagiários" },
];

function Membros() {
  const [members, setMembers] = useState<MemberRow[]>([]);

  useEffect(() => {
    supabase
      .from("members")
      .select("*")
      .order("id")
      .then(({ data }) => {
        if (data) setMembers(data as any);
      });
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Membros</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">
            Quem faz a FEA Angels.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Passe o mouse sobre os cards para ver mais informações.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        {sections.map((section) => {
          const group = members.filter((m) => m.category === section.key);
          if (group.length === 0) return null;

          return (
            <section key={section.key} className="mb-20">
              <p className="eyebrow mb-10">{section.title}</p>

              <div className="flex flex-wrap gap-6">
                {group.map((m) => (
                  <div key={m.name} className="w-44">
                    <FlipCard
                      front={
                        <div className="flex flex-col items-center text-center">
                          <div className="flex h-36 w-36 items-center justify-center bg-surface-container-low border border-border overflow-hidden">
                            {m.photo_url ? (
                              <img
                                src={m.photo_url}
                                alt={m.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-16 w-16 text-muted-foreground/30" />
                            )}
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-ink">{m.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 max-w-36 leading-relaxed">
                              {m.role}
                            </p>
                          </div>
                        </div>
                      }
                      back={
                        <div className="flex h-44 w-44 flex-col items-center justify-center bg-navy p-4 text-center">
                          <p className="text-sm font-semibold text-white">{m.name}</p>
                          <p className="text-xs text-white/60 mt-1">{m.role}</p>
                          <p className="mt-3 text-xs text-white/70 leading-relaxed line-clamp-4">
                            {m.bio}
                          </p>
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
