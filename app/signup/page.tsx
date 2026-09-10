"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center border border-paper-line bg-white/60 p-8">
          <h1 className="font-serif text-2xl mb-2">Check your inbox</h1>
          <p className="text-sm text-ink-light/80 leading-relaxed">
            We sent a confirmation link to <span className="font-mono">{email}</span>.
            Click it to activate your account, then log in.
          </p>
          <Link href="/login" className="inline-block mt-6 text-seal-dark underline underline-offset-4 text-sm">
            Back to log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-serif text-xl block text-center mb-8">
          Setter
        </Link>
        <div className="border border-paper-line bg-white/60 p-8">
          <h1 className="font-serif text-2xl mb-1">Create your account</h1>
          <p className="text-sm text-ink-faint mb-6">It takes a minute.</p>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-paper-line bg-paper px-3 py-2 text-sm focus:border-seal outline-none"
              />
              <p className="text-xs text-ink-faint mt-1">At least 6 characters.</p>
            </div>

            {error && <p className="text-sm text-rust">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-2.5 text-sm hover:bg-ink-light transition-colors disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-ink-faint mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-seal-dark underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
