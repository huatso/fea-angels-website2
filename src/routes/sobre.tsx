import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — FEA Angels" },
      { name: "description", content: "Conheça a história, valores e equipe da FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/sobre" }],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Sobre</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">
            Sobre a FEA Angels.
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Texto principal */}
          <div className="lg:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg leading-[1.75]">
              Fundada por ex-alunos da FEA, a Faculdade de Economia, Administração e Contabilidade
              da USP, a FEA Angels é uma rede de
              investidores-anjo, executivos, empreendedores e alumni da FEA-USP com a missão de
              transformar o empreendedorismo por meio de capital, conhecimento e conexões qualificadas.
            </p>
            <p className="leading-[1.75]">
              Funcionamos como uma ponte entre investidores e empreendedores. Os investidores
              associados têm acesso aos nossos eventos, onde apresentamos startups em busca de
              capital financeiro e intelectual que foram previamente selecionadas e avaliadas por
              um comitê de avaliação interno.
            </p>
            <p className="leading-[1.75]">
              Além disso, a FEA Angels é uma associação ativa que promove trocas relevantes entre
              seus membros e contribui para o fortalecimento do ecossistema de inovação e negócios no Brasil.
              Seus associados têm a oportunidade de se envolver diretamente nas atividades internas da rede.
              No Comitê de Avaliação, por exemplo, podem analisar em profundidade oportunidades de investimento
              e dialogar diretamente com founders selecionados pelo time de Startups.
              Já nas mentorias, acompanham de perto o desenvolvimento dos empreendedores,
              oferecendo direcionamento estratégico e compartilhando aprendizados construídos a partir da experiência prática.
            </p>
            <p className="leading-[1.75]">
              Desde 2018, a FEA Angels já reuniu mais de 100 investidores associados ativos e
              ultrapassou R$ 5 milhões investidos, consolidando-se como uma das principais redes
              de investimento anjo do país.
            </p>
          </div>

          {/* Stats sidebar */}
          <div className="space-y-8 lg:pt-2">
            {[
              { n: "2018", l: "Ano de fundação" },
              { n: "100+", l: "Associados ativos" },
              { n: "50+", l: "Startups investidas" },
              { n: "R$ 5M+", l: "Valor investido" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-cyan-deep pl-6">
                <p className="font-serif text-4xl text-navy">{s.n}</p>
                <p className="nav-label text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Valores */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3 border-t border-border pt-16">
          {[
            { t: "Excelência", d: "Rigor analítico que herdamos da escola." },
            { t: "Comunidade", d: "Decisões em sindicato, aprendizado coletivo." },
            { t: "Impacto", d: "Capital paciente para construir negócios duradouros." },
          ].map((v) => (
            <div key={v.t} className="border-t-2 border-cyan-deep pt-6">
              <h3 className="font-serif text-2xl text-ink">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center border-t border-border pt-16">
          <p className="text-muted-foreground mb-6 text-lg">Quer fazer parte desta história?</p>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90"
          >
            Quero me Associar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
