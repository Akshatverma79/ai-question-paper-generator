"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ email }: { email?: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-paper-line bg-paper/95 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl">
          Setter
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="hover:text-seal-dark transition-colors">
            Papers
          </Link>
          <Link href="/dashboard/new" className="hover:text-seal-dark transition-colors">
            New paper
          </Link>
          {email && <span className="text-ink-faint font-mono text-xs hidden sm:inline">{email}</span>}
          <button onClick={handleLogout} className="text-ink-faint hover:text-rust transition-colors">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
