import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar email={user?.email} />
      <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}
