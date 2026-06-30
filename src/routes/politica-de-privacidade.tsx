import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — FEA Angels" },
      {
        name: "description",
        content:
          "Política de Privacidade da FEA Angels em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
      },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/politica-de-privacidade" }],
  }),
  component: PoliticaDePrivacidade,
});

function PoliticaDePrivacidade() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">
        Privacidade
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">
        Política de Privacidade
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Última atualização: 12 de fevereiro de 2026
      </p>

      <div className="mt-12 space-y-8 text-[15px] text-muted-foreground leading-[1.75] text-justify">
        <p>
          A <strong>FEA Angels</strong> respeita a sua privacidade e está
          comprometida com a proteção dos seus dados pessoais, em conformidade
          com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).
        </p>
        <p>
          Esta Política explica como coletamos, utilizamos e protegemos seus
          dados ao interagir com nossos formulários, incluindo formulários de
          geração de leads no LinkedIn.
        </p>

        <Section title="1. Quem somos">
          <p>
            A FEA Angels é uma rede de investimento anjo que conecta startups a
            investidores qualificados.
          </p>
          <p>
            Para fins da legislação aplicável, a FEA Angels atua como
            Controladora dos dados pessoais coletados.
          </p>
          <p>
            Contato para assuntos relacionados à privacidade:{" "}
            <a
              href="mailto:contato@feaangels.com.br"
              className="text-cyan-deep underline transition-colors hover:text-cyan-deep/70"
            >
              contato@feaangels.com.br
            </a>
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>
            Ao preencher nossos formulários, podemos coletar os seguintes dados
            pessoais:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nome</li>
            <li>Sobrenome</li>
            <li>E-mail</li>
            <li>Telefone / contato</li>
          </ul>
        </Section>

        <Section title="3. Finalidade do uso dos dados">
          <p>Os dados coletados poderão ser utilizados para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Entrar em contato com você</li>
            <li>Enviar informações sobre a FEA Angels</li>
            <li>Compartilhar conteúdos institucionais, eventos e oportunidades</li>
            <li>Responder solicitações feitas por você</li>
          </ul>
        </Section>

        <Section title="4. Compartilhamento de dados">
          <p>A FEA Angels não vende dados pessoais.</p>
          <p>
            Os dados poderão ser compartilhados apenas quando necessário para
            cumprimento de obrigações legais ou para operacionalização de
            serviços internos.
          </p>
        </Section>

        <Section title="5. Armazenamento e segurança">
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger
            seus dados contra acesso não autorizado, vazamento ou uso indevido.
          </p>
          <p>
            Os dados serão armazenados pelo tempo necessário para cumprir as
            finalidades descritas nesta Política ou conforme exigido por lei.
          </p>
        </Section>

        <Section title="6. Seus direitos">
          <p>
            Nos termos da LGPD, você pode solicitar a qualquer momento:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Acesso aos seus dados</li>
            <li>Correção de informações</li>
            <li>Exclusão dos seus dados</li>
            <li>Revogação do consentimento</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail:{" "}
            <a
              href="mailto:contato@feaangels.com.br"
              className="text-cyan-deep underline transition-colors hover:text-cyan-deep/70"
            >
              contato@feaangels.com.br
            </a>
          </p>
        </Section>

        <Section title="7. Atualizações">
          <p>
            Esta Política poderá ser atualizada periodicamente. Recomendamos a
            consulta regular desta página.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
