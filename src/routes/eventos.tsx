import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getEvents, getUpcoming, getPast } from "@/lib/events.server";
import { sendNewsletterEmail } from "@/lib/email.server";
import { useNewsletterEnabled } from "@/lib/content";
import { Bell, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/eventos")({
  loader: async () => {
    const all = await getEvents();
    return {
      upcoming: getUpcoming(all),
      past: getPast(all),
    };
  },
  head: () => ({
    meta: [
      { title: "Eventos — FEA Angels" },
      { name: "description", content: "Pitch Nights, workshops e encontros da FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/eventos" }],
    scripts: [
      {
        src: "https://embed.lu.ma/checkout-button.js",
        id: "luma-checkout",
      },
    ],
  }),
  component: Eventos,
});

function Eventos() {
  const { upcoming, past } = Route.useLoaderData();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const newsletterEnabled = useNewsletterEnabled();

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await sendNewsletterEmail({ data: { email } });
      toast.success("Inscrição confirmada! Você receberá novidades por e-mail.");
      setEmail("");
    } catch {
      toast.error("Erro ao inscrever. Tente novamente.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="border-b border-border bg-surface-container-low">
        <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
          <div className="eyebrow mb-4">Eventos</div>
          <h1 className="font-serif text-5xl leading-tight text-navy lg:text-7xl">Agenda.</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 md:px-16 py-28">
        <Section title="Próximos" items={upcoming} />
        {past.length > 0 && <Section title="Realizados" items={past} muted />}

        {/* Newsletter */}
        {newsletterEnabled && (
          <section className="mt-24 border-t border-border pt-16">
            <div className="flex items-start gap-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-surface-container-low border border-border">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl text-ink">Receba novidades</h2>
                <p className="mt-1 text-sm text-muted-foreground max-w-md leading-relaxed">
                  Fique por dentro dos próximos Pitch Nights, workshops e encontros da rede.
                </p>

                <form onSubmit={onSubscribe} className="mt-6 flex gap-3 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="flex-1 border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-navy placeholder:text-muted-foreground/40"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="inline-flex items-center gap-1.5 bg-navy text-white px-6 py-2.5 nav-label transition-all hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                  >
                    {subscribing ? "Enviando..." : "Inscrever"}
                    {!subscribing && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type EventItem = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  status: "upcoming" | "past";
  url: string | null;
  luma_event_id: string | null;
};

function Section({ title, items, muted }: { title: string; items: EventItem[]; muted?: boolean }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-16">
      <p className="nav-label text-muted-foreground tracking-widest mb-8">{title}</p>
      <div className="divide-y divide-border border-y border-border">
        {items.map((e) => (
          <div key={e.title} className={"py-8 " + (muted ? "opacity-40" : "")}>
            <p className="font-serif text-2xl text-ink">{e.title}</p>
            <p className="mt-1 text-sm text-cyan-deep">{e.date} &middot; {e.location}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
            {e.luma_event_id && !muted && (
              <a
                href={`https://luma.com/event/${e.luma_event_id}`}
                className="luma-checkout--button mt-3 inline-flex items-center gap-1 nav-label text-cyan-deep transition-colors hover:opacity-70"
                data-luma-action="checkout"
                data-luma-event-id={e.luma_event_id}
              >
                Garantir vaga <ArrowRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
