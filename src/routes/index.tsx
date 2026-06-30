import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Network, Calendar, BookOpen, Newspaper, Handshake, ChevronDown } from "lucide-react";
import { getEvents, getUpcoming } from "@/lib/events.server";
import { supabase } from "@/lib/supabase";
import { getPageContent, getPortfolio } from "@/lib/content";
import type { PortfolioItem } from "@/lib/content";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Stat = { section: string; n: number; label: string; prefix?: string; suffix?: string };

const slideDefaults = [
  "https://feaangels.com.br/wp-content/uploads/2024/03/slide2.jpg",
  "https://feaangels.com.br/wp-content/webp-express/webp-images/uploads/2025/06/IMG_5258-1-scaled.jpg.webp",
  "https://feaangels.com.br/wp-content/webp-express/webp-images/uploads/2025/06/b50c5223-4706-4010-806f-1a94d84c04f4-1-e1749220350936.jpeg.webp",
  "https://feaangels.com.br/wp-content/webp-express/webp-images/uploads/2025/06/IMG_5238-1-scaled.jpg.webp",
];

export const Route = createFileRoute("/")({
  loader: async () => {
    const all = await getEvents();
    return { next: getUpcoming(all)[0] ?? null };
  },
  head: () => ({
    meta: [
      { title: "FEA Angels — Rede de Investimento Anjo da FEA-USP" },
      {
        name: "description",
        content:
          "Mais de R$ 5M investidos em 50+ startups desde 2018. Rede de investidores-anjo, executivos e empreendedores da FEA-USP fomentando o ecossistema de startups brasileiro.",
      },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/" }],
  }),
  component: Index,
});

function Index() {
  Route.useLoaderData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<string[]>(slideDefaults);
  const [content, setContent] = useState<Record<string, string>>({});
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [faqInvestors, setFaqInvestors] = useState<{ question: string; answer: string }[]>([]);
  const [faqStartups, setFaqStartups] = useState<{ question: string; answer: string }[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getPageContent("home"),
      getPortfolio(),
      supabase.from("faq").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("sort_order"),
    ]).then(([c, p, faq, dep]) => {
      setContent(c);
      setPortfolio(p);
      const s = [];
      for (let i = 0; i < 4; i++) {
        s.push(c[`slide_${i}`] || slideDefaults[i]);
      }
      setSlides(s);
      if (faq.data) {
        setFaqInvestors((faq.data as any[]).filter((f: any) => f.category === "investors"));
        setFaqStartups((faq.data as any[]).filter((f: any) => f.category === "startups"));
      }
      if (dep.data) setTestimonials(dep.data);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const heroTitle =
    content.hero_title || "Transformando o empreendedorismo por meio do investimento anjo";
  const heroHighlight = content.hero_title_highlight || "investimento anjo";
  const heroDesc =
    content.hero_description ||
    "A principal rede de investidores-anjo da FEA-USP. Capital inteligente, mentoria qualificada e conexões reais para as startups mais promissoras do Brasil.";

  const stats: Stat[] = [
    {
      section: "stat_startups",
      n: Number(content.stat_startups) || 50,
      label: content.stat_startups_label || "Startups investidas",
    },
    {
      section: "stat_associados",
      n: Number(content.stat_associados) || 100,
      label: content.stat_associados_label || "Associados",
    },
    {
      section: "stat_valor",
      n: Number(content.stat_valor) || 5,
      label: content.stat_valor_label || "Valor investido",
      prefix: content.stat_valor_prefix || "R$ ",
      suffix: content.stat_valor_suffix || "M+",
    },
    {
      section: "stat_avaliadas",
      n: Number(content.stat_avaliadas) || 500,
      label: content.stat_avaliadas_label || "Startups avaliadas",
    },
  ];

  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section className="relative pt-16 min-h-screen flex items-center">
        {/* Background slides */}
        {slides.map((url, i) => (
          <div
            key={url}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url('${url}')`, opacity: currentSlide === i ? 1 : 0 }}
          />
        ))}
        {/* Overlay: left opaque, right transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/20" />

        {/* Slide dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-300 ${
                currentSlide === i ? "w-8 bg-navy" : "w-1.5 bg-navy/30"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-40 w-full">
          <div className="max-w-2xl">
            <div className="eyebrow mb-6">FEA Angels</div>

            <h1 className="font-serif text-5xl leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
              {heroTitle.replace(heroHighlight, "")}
              <span className="text-cyan-deep">{heroHighlight}</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {heroDesc}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Quero Investir <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/startups"
                className="inline-flex items-center gap-2 border-2 border-cyan-deep text-cyan-deep px-8 py-4 nav-label transition-all hover:bg-cyan-deep hover:text-white active:scale-[0.98]"
              >
                Quero receber investimento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NÚMEROS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="border-b border-border bg-surface-container"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-20">
          <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={i < 2 ? "border-b border-border pb-12 lg:border-b-0 lg:pb-0" : ""}
              >
                <p className="font-serif text-5xl text-navy lg:text-6xl tracking-tight">
                  {s.prefix || "+ "}
                  <AnimatedCounter value={s.n} />
                  {s.suffix || ""}
                </p>
                <p className="mt-2 nav-label text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== PORTFÓLIO ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="border-b border-border bg-background"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-36">
          <div className="max-w-2xl mb-12">
            <div className="eyebrow mb-3">Portfólio</div>
            <h2 className="font-serif text-4xl text-navy lg:text-5xl leading-tight">
              Startups em que investimos.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Startups selecionadas por nosso Comitê de Avaliação, apresentadas à rede em nossos Pitch Nights e investidas por nossos associados.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(portfolio.length > 0 ? portfolio : []).map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="group grayscale-card border border-border bg-card p-6 soft-lift"
              >
                <div className="aspect-video mb-5 bg-secondary overflow-hidden">
                  {s.logo_url ? (
                    <img src={s.logo_url} alt={s.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="font-serif text-2xl font-semibold text-navy/40">{s.name[0]}</span>
                    </div>
                  )}
                </div>
                <span className="inline-block bg-navy/10 text-navy text-xs font-semibold px-2 py-0.5 uppercase tracking-wider mb-3">
                  {s.sector}
                </span>
                <p className="font-serif text-lg text-ink">{s.name}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.stage}</span>
                  <span className="text-xs text-muted-foreground">{s.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ==================== POR QUE SE ASSOCIAR — layout assimétrico ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="border-b border-border"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Sticky left column */}
            <div className="lg:col-span-5 lg:sticky top-24">
              <div className="eyebrow mb-4">Para investidores</div>
              <h2 className="font-serif text-4xl text-navy lg:text-5xl leading-tight mb-6">
                Por que se associar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Já imaginou ter acesso a startups previamente selecionadas e direcionadas à sua tese
                para investir? Venha nos ajudar a fomentar os próximos unicórnios brasileiros.
              </p>
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90"
              >
                Associe-se agora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Benefits grid — right column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Network,
                  t: "Networking",
                  d: "Tenha acesso direto a empreendedores, investidores e formadores de opinião em inovação.",
                },
                {
                  icon: Calendar,
                  t: "Eventos",
                  d: "Participe do FEA Angels Day, Pitch Night, Papo de Anjo e jantares exclusivos.",
                },
                {
                  icon: BookOpen,
                  t: "Conteúdo e Formação",
                  d: "Acesso aos cursos da FEA para investidores e conteúdos exclusivos.",
                },
                {
                  icon: Newspaper,
                  t: "FEA News",
                  d: "Notícias diárias sobre investimentos e o ecossistema de inovação do Brasil.",
                },
              ].map((b) => (
                <div
                  key={b.t}
                  className="group border border-border bg-surface-container-low p-7 transition-colors hover:border-navy soft-lift"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-navy/10 group-hover:bg-navy/15 transition-colors mb-5">
                    <b.icon className="h-5 w-5 text-navy" />
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">{b.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                </div>
              ))}

              {/* Full-width card */}
              <div className="sm:col-span-2 group border border-border bg-surface-container-low p-7 transition-colors hover:border-navy soft-lift">
                <div className="flex h-10 w-10 items-center justify-center bg-navy/10 group-hover:bg-navy/15 transition-colors mb-5">
                  <Handshake className="h-5 w-5 text-navy" />
                </div>
                <h3 className="font-serif text-xl text-ink mb-2">Participe de Comitês</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Atue nos comitês de avaliação, aprendendo a avaliar e selecionar as melhores startups para a nossa rede.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA investidores — fundo navy */}
        <div className="bg-navy">
          <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-20 text-center">
            <div className="eyebrow justify-center mb-4 text-white/60 before:bg-white/40">Associe-se</div>
            <h2 className="font-serif text-4xl text-white lg:text-5xl leading-tight max-w-2xl mx-auto">
              Torne-se um investidor anjo da FEA Angels
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto leading-relaxed">
              Acesso a startups pré-selecionadas, eventos exclusivos, conteúdo de formação e uma
              rede de investidores e empreendedores de alto nível.
            </p>
            <div className="mt-10">
              <Link
                to="/cadastro"
                className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 nav-label transition-all hover:opacity-90"
              >
                Associe-se agora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ==================== DIVIDER EDITORIAL ==================== */}
      <div className="w-full h-[560px] relative overflow-hidden bg-navy">
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src={slides[1] || slideDefaults[1]}
          alt="FEA Angels evento"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/40 to-transparent flex items-center px-5 md:px-16">
          <div className="max-w-2xl text-white">
            <h2 className="font-serif text-4xl lg:text-6xl mb-6">Uma rede forjada na excelência.</h2>
            <p className="text-lg opacity-80 mb-6">
              Conectando o DNA acadêmico da USP com a agilidade do mercado de Venture Capital.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-0.5 bg-cyan-deep" />
              <span className="nav-label tracking-widest opacity-70">FEA Angels — desde 2018</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DEPOIMENTOS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="border-b border-border bg-surface-container-low"
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-36">
          <div className="max-w-2xl mb-16">
            <div className="eyebrow mb-3">Depoimentos</div>
            <h2 className="font-serif text-4xl text-navy lg:text-5xl leading-tight">
              O que dizem nossos membros.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {(testimonials.length > 0 ? testimonials : []).map((t: any) => (
              <div
                key={t.name}
                className="flex flex-col border border-border bg-card p-7 soft-lift"
              >
                <span
                  className={`self-start px-2.5 py-0.5 text-xs font-semibold mb-5 uppercase tracking-wider ${
                    t.type === "investor"
                      ? "bg-navy/10 text-navy"
                      : "bg-cyan-deep/10 text-cyan-deep"
                  }`}
                >
                  {t.type === "investor" ? "Investidor(a)" : "Fundador(a)"}
                </span>
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
          {testimonials.length === 0 && (
            <p className="mt-8 text-xs text-muted-foreground/50">
              * Depoimentos reais de associados serão publicados em breve.
            </p>
          )}
        </div>
      </motion.section>

      {/* ==================== CTA STARTUPS ==================== */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-36">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="eyebrow mb-4">Startups</div>
              <h2 className="font-serif text-4xl text-navy lg:text-5xl leading-tight mb-4">
                Procurando investimento?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg mb-8">
                Procurando investidores que acreditem no seu negócio? Além do capital, nossos
                investidores apoiam os empreendedores com experiência e conexões qualificadas.
              </p>
              <Link
                to="/startups"
                className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 nav-label transition-all hover:opacity-90"
              >
                Cadastrar minha Startup <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {["Capital", "Mentoria", "Conexões", "Visibilidade"].map((item) => (
                <div
                  key={item}
                  className="border border-border bg-surface-container-low p-8 text-center"
                >
                  <p className="font-serif text-xl text-navy">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28 lg:py-36">
          <div className="max-w-2xl mb-16">
            <div className="eyebrow mb-3">FAQ</div>
            <h2 className="font-serif text-4xl text-navy lg:text-5xl leading-tight">
              Perguntas frequentes.
            </h2>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="nav-label text-muted-foreground mb-6">Para investidores</p>
              <Accordion type="single" collapsible>
                {faqInvestors.map((item, i) => (
                  <AccordionItem key={i} value={`inv-${i}`}>
                    <AccordionTrigger className="text-left text-lg font-serif text-ink">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[17px] text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <p className="nav-label text-muted-foreground mb-6">Para startups</p>
              <Accordion type="single" collapsible>
                {faqStartups.map((item, i) => (
                  <AccordionItem key={i} value={`st-${i}`}>
                    <AccordionTrigger className="text-left text-lg font-serif text-ink">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[17px] text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
