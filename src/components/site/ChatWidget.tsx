import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { env } from "@/lib/env";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "O que é a FEA Angels?",
  "Como submeto minha startup?",
  "Como me tornar anjo?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model: env.CHAT_MODEL }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) toast.error("Muitas requisições. Tente novamente em alguns instantes.");
        else if (res.status === 402) toast.error("Créditos de IA esgotados. Avise o administrador.");
        else toast.error("Erro no chat. Tente novamente.");
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.error(e);
        toast.error("Erro de conexão.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-deep text-white shadow-lg shadow-cyan-deep/30 transition-transform hover:scale-105"
        aria-label="Abrir chat"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[32rem] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <p className="font-serif text-lg leading-tight">Assistente FEA Angels</p>
            <p className="text-xs opacity-80">Pergunte sobre a comunidade, pitches e investimento anjo.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Como posso ajudar?</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-lg border border-border px-3 py-2 text-left text-sm hover:border-cyan-deep hover:text-cyan-deep"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm text-foreground"
                }
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}

            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="mr-auto rounded-2xl rounded-tl-sm bg-secondary px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border bg-background px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreva sua mensagem…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-cyan-deep"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-cyan-deep p-2 text-white disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
