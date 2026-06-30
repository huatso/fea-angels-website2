import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Cadastre-se — FEA Angels" },
      { name: "description", content: "Cadastre-se na rede FEA Angels." },
    ],
    links: [{ rel: "canonical", href: "https://feaangels.com.br/cadastro" }],
  }),
  component: Cadastro,
});

const requirements = [
  { label: "Pelo menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Um caractere especial", test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

function Cadastro() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inviteCode = import.meta.env.VITE_INVITE_CODE as string;
  const inviteOk = invite === inviteCode;
  const passwordOk = requirements.every((r) => r.test(password));

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordOk || !inviteOk) return;
    setError("");
    setLoading(true);
    const { error: err } = await signUp(email, password, name);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Junte-se</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Cadastre-se</h1>
      <p className="mt-2 text-sm text-muted-foreground">Crie sua conta para acessar a comunidade.</p>

      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Nome completo</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
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
          <span className="text-sm font-medium text-ink">Código de convite</span>
          <input
            type="text"
            required
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
          />
          {invite.length > 0 && !inviteOk && (
            <p className="mt-1 text-xs text-red-500">Código inválido</p>
          )}
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
          {password.length > 0 && (
            <ul className="mt-2 space-y-1">
              {requirements.map((r) => {
                const ok = r.test(password);
                return (
                  <li key={r.label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-muted-foreground"}`}>
                    <span className="text-xs">{ok ? "✓" : "•"}</span>
                    {r.label}
                  </li>
                );
              })}
            </ul>
          )}
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || (password.length > 0 && !passwordOk) || (invite.length > 0 && !inviteOk)}
          className="w-full bg-navy px-5 py-3 nav-label text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Já tem conta?{" "}
        <Link to="/login" className="text-cyan-deep transition-colors hover:text-cyan-deep/70">Entrar</Link>
      </p>
    </div>
  );
}
