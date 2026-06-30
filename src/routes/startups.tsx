import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEALUM_URL =
  "https://app.dealum.com/#/company/application/new/137361/nez1qhssrrnsxl1n4x3cta21oq9bvp40";
const DEFAULT_VIDEO_URL = "https://vimeo.com/1205901522";

export const Route = createFileRoute("/startups")({
  head: () => ({
    meta: [
      { title: "Startups — FEA Angels" },
      { name: "description", content: "Submeta sua startup para a FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/startups" }],
    scripts: [
      {
        src: "https://player.vimeo.com/api/player.js",
        id: "vimeo-player",
      },
    ],
  }),
  component: Startups,
});

function Startups() {
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO_URL);

  useEffect(() => {
    supabase
      .from("page_content")
      .select("content")
      .eq("page", "startups")
      .eq("section", "video_url")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setVideoUrl(data.content);
      });
  }, []);

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

        {/* Recap em vídeo */}
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
          <VideoEmbed url={videoUrl} />
        </div>

        {/* Em quem investimos */}
        <div className="max-w-2xl mb-20">
          <h2 className="font-serif text-3xl text-ink mb-6">Em quem investimos</h2>
          <p className="text-muted-foreground leading-relaxed">
            Organizamos eventos para apresentar startups em fases de:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-3 text-muted-foreground">
            <li>Faturamento anual menor que R$ 500 mil</li>
            <li>Faturamento anual maior que R$ 500 mil</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-6">
            Para sua startup chegar ao nosso grupo de investidores, deve respeitar alguns
            critérios:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-3 text-muted-foreground">
            <li>
              A empresa deve ser uma startup: empresa de base tecnológica com um modelo de
              negócios repetível e escalável.
            </li>
            <li>Enviar um pitch deck em formato PDF que contenha em média 20 slides.</li>
          </ul>
        </div>

        {/* Como funciona */}
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl text-ink mb-6">Como funciona?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Guia da Startup FEA Angels — saiba mais sobre nosso processo.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Nós operamos como uma "vitrine" na qual você, empreendedor, pode compartilhar seu
            modelo de negócios com o comitê de seleção. Assim que submeter seu pitch, ele será
            avaliado para apresentação de fato aos investidores.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-6">
            Recomendamos que o pitch submetido contenha os seguintes pontos:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-3 text-muted-foreground">
            <li>
              <strong className="text-ink">Problema:</strong> qual é o problema e quem é afetado.
            </li>
            <li>
              <strong className="text-ink">Solução:</strong> qual é o produto ou serviço, como
              funciona e como ameniza ou resolve o problema.
            </li>
            <li>
              <strong className="text-ink">Modelo de negócios:</strong> modelo de faturamento,
              quanto e como se cobra, incentivos ao consumidor.
            </li>
            <li>
              <strong className="text-ink">Gestão:</strong> equipe (formação e histórico dos
              sócios), mentores/advisors.
            </li>
            <li>
              <strong className="text-ink">Mercado:</strong> tamanho, oportunidades e mercados de
              atuação (% de crescimento, cenário, etc.).
            </li>
            <li>
              <strong className="text-ink">Concorrência:</strong> direta e indireta e vantagens
              competitivas.
            </li>
            <li>
              <strong className="text-ink">Futuro:</strong> estratégias de crescimento e
              projeções de resultados esperados para os próximos anos.
            </li>
            <li>
              <strong className="text-ink">Informações da rodada:</strong> valor buscado pela
              empresa, aplicação dos recursos, valuation, captable e modelo de contrato.
            </li>
          </ul>

          <p className="text-muted-foreground leading-relaxed mt-8 mb-4">
            Envie o seu pitch preenchendo o formulário:
          </p>
          <a
            href={DEALUM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Acesse o Formulário <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const vimeoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

  if (vimeoId) {
    return (
      <div className="mt-4 mx-auto max-w-sm">
        <div style={{ padding: "177.78% 0 0 0", position: "relative" }}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            title="Recap — Minerva | FEA Angels"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 aspect-video w-full">
      <iframe
        src={url.replace("watch?v=", "embed/").replace("shorts/", "embed/")}
        title="Recap — Minerva | FEA Angels"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
