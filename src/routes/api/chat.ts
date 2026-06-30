import { createFileRoute } from "@tanstack/react-router";

const SYSTEM_PROMPT = `Você é o assistente virtual da FEA Angels, comunidade de investidores anjo formada por ex-alunos da FEA-USP (Faculdade de Economia, Administração e Contabilidade da USP).

Sobre a FEA Angels:
- Rede de investidores-anjo, executivos, empreendedores e alumni da FEA-USP
- Missão: transformar o empreendedorismo brasileiro por meio de capital, conhecimento e conexões qualificadas
- Realiza Pitch Nights periódicos onde startups apresentam suas teses para a comunidade
- Investe em estágios iniciais (anjo / pré-seed)

Você ajuda fundadores que querem submeter pitches, profissionais que querem se tornar anjos, e curiosos sobre investimento anjo no Brasil.

Seja conciso, cordial e prático. Responda em português brasileiro. Use markdown leve (negrito, listas curtas) quando ajudar a clareza. Se a pergunta sair do escopo, redirecione gentilmente para os canais de contato do site.`;

// Allowlist server-side: cliente não escolhe modelo arbitrário
const ALLOWED_MODELS = new Set([
  "deepseek/deepseek-v4-flash:free",
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "google/gemini-2.5-pro",
  "google/gemma-4-31b-it:free",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
  "openai/gpt-5",
]);
const DEFAULT_MODEL = "google/gemma-4-31b-it:free";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.AI_API_KEY;
        if (!apiKey) throw new Error("Missing env var: AI_API_KEY");

        let body: { messages?: unknown; model?: unknown };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "JSON inválido" }), {
            status: 400, headers: { "Content-Type": "application/json" },
          });
        }

        if (!Array.isArray(body.messages) || body.messages.length === 0) {
          return new Response(JSON.stringify({ error: "messages obrigatório" }), {
            status: 400, headers: { "Content-Type": "application/json" },
          });
        }

        // Sanitiza e limita histórico
        const cleanMessages: ChatMessage[] = (body.messages as unknown[])
          .filter((m): m is ChatMessage =>
            !!m && typeof m === "object" &&
            ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
            typeof (m as ChatMessage).content === "string" &&
            (m as ChatMessage).content.length > 0 &&
            (m as ChatMessage).content.length < 4000,
          )
          .slice(-20);

        const model =
          typeof body.model === "string" && ALLOWED_MODELS.has(body.model)
            ? body.model
            : DEFAULT_MODEL;

        const upstream = await fetch(
          process.env.AI_API_URL || "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://feaangels.com.br",
              "X-Title": "FEA Angels",
            },
            body: JSON.stringify({
              model,
              stream: true,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...cleanMessages,
              ],
            }),
          },
        );

        if (!upstream.ok) {
          if (upstream.status === 429) {
            return new Response(
              JSON.stringify({ error: "Limite de requisições atingido." }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }
          if (upstream.status === 402) {
            return new Response(
              JSON.stringify({ error: "Créditos esgotados." }),
              { status: 402, headers: { "Content-Type": "application/json" } },
            );
          }
          const txt = await upstream.text();
          console.error("AI gateway error", upstream.status, txt);
          return new Response(
            JSON.stringify({ error: "Erro upstream" }),
            { status: 502, headers: { "Content-Type": "application/json" } },
          );
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
