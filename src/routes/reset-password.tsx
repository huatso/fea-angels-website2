import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

function env(key: string): string {
  if (typeof process !== "undefined" && process.env?.[key]) return process.env[key]!;
  const val = (import.meta.env as any)[key];
  if (val) return val as string;
  throw new Error(`Missing env var: ${key}`);
}

const supabaseUrl = env("VITE_SUPABASE_URL");
const supabaseAnonKey = env("VITE_SUPABASE_ANON_KEY");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Redefinir senha — FEA Angels" }],
  }),
  component: ResetPassword,
});

const requirements = [
  { label: "Pelo menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Um número", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "Um caractere especial",
    test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  },
];

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const passwordOk = requirements.every((r) => r.test(password));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não conferem");
      return;
    }
    if (!passwordOk) return;
    setError("");
    setLoading(true);

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? "",
      });
    }

    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      setDone(true);
      toast.success("Senha redefinida com sucesso!");
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Sucesso</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Senha redefinida!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sua senha foi alterada com sucesso.</p>
        <Link
          to="/login"
          className="mt-8 block w-full rounded-lg bg-navy px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy/90"
        >
          Fazer login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-6 py-28">
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-deep font-medium">Redefinição</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Nova senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">Escolha uma nova senha para sua conta.</p>

      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Nova senha</span>
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
                  <li
                    key={r.label}
                    className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <span className="text-xs">{ok ? "✓" : "•"}</span>
                    {r.label}
                  </li>
                );
              })}
            </ul>
          )}
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Confirmar senha</span>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 w-full border-b border-border bg-transparent px-0 py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || (password.length > 0 && !passwordOk)}
          className="w-full rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-navy/90 hover:shadow-md disabled:opacity-50"
        >
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}
