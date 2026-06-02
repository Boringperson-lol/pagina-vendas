"use client";

import { LockKeyhole, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    setIsLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Nao foi possivel entrar.");
      return;
    }

    router.replace(searchParams.get("from") || "/painelsecreto");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-soft px-4 py-10 text-ink">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
        <form onSubmit={handleSubmit} className="w-full rounded-md bg-white p-6 shadow-ege md:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-white">
            <LockKeyhole size={24} aria-hidden="true" />
          </div>
          <p className="text-sm font-black uppercase text-accent">Painel EGE</p>
          <h1 className="mt-2 text-3xl font-black text-primary">Acesso seguro</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Entre com as credenciais configuradas na Vercel.</p>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-extrabold text-muted">Usuario</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="min-h-12 w-full rounded-md border border-primary/15 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-extrabold text-muted">Senha</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              className="min-h-12 w-full rounded-md border border-primary/15 bg-white px-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-accent">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 font-black text-white shadow-ege transition hover:bg-secondary hover:text-primary disabled:opacity-60"
          >
            <LogIn size={18} aria-hidden="true" />
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
