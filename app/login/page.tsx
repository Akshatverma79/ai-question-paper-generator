"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-serif text-xl block text-center mb-8">
          Setter
        </Link>
        <div className="border border-paper-line bg-white/60 p-8">
          <h1 className="font-serif text-2xl mb-1">Welcome back</h1>
          <p className="text-sm text-ink-faint mb-6">Log in to your papers.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-ink-faint mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-paper-line bg-paper px-3 py-2 text-sm focus:border-seal outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-ink-faint mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-paper-line bg-paper px-3 py-2 text-sm focus:border-seal outline-none"
              />
            </div>

            {error && <p className="text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-2.5 text-sm hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-ink-faint mt-6">
          New here?{" "}
          <Link href="/signup" className="text-seal-dark underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
