import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — FEA Angels" },
      { name: "description", content: "Acesse a área de membros da FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/login" }],
  }),
  component: Login,
});

function Login() {
  const { signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate({ to: "/dashboard" });
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setResetSent(true);
    }
  }

  if (resetSent) {
    return (
      <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">
          Recuperação
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink">E-mail enviado!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </p>
        <button
          type="button"
          onClick={() => {
            setResetMode(false);
            setResetSent(false);
            setEmail("");
          }}
          className="mt-8 w-full bg-navy px-5 py-3 nav-label text-white transition-all hover:opacity-90"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  if (resetMode) {
    return (
      <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">
          Recuperação
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Esqueci a senha</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Receba um link de recuperação no seu e-mail.
        </p>

        <form onSubmit={handleReset} className="mt-10 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
            />
          </label>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy px-5 py-3 nav-label text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setResetMode(false)}
          className="mt-6 text-sm text-muted-foreground text-center transition-colors hover:text-foreground"
        >
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Acesso</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Entrar</h1>
      <p className="mt-2 text-sm text-muted-foreground">Área restrita aos membros da rede.</p>

      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Senha</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setResetMode(true)}
            className="text-xs text-muted-foreground transition-colors hover:text-cyan-deep"
          >
            Esqueci a senha
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy px-5 py-3 nav-label text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Ainda não tem conta?{" "}
        <Link to="/cadastro" className="text-cyan-deep transition-colors hover:text-cyan-deep/70">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
