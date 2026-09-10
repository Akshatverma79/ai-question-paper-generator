import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { QuestionPaper } from "@/lib/types";
import PaperListItem from "@/components/PaperListItem";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: papers } = await supabase
    .from("question_papers")
    .select("*")
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const list = (papers ?? []) as QuestionPaper[];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">Your papers</h1>
          <p className="text-sm text-ink-faint">
            {list.length} paper{list.length === 1 ? "" : "s"} generated so far.
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-light transition-colors"
        >
          New paper
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-paper-line p-12 text-center">
          <p className="font-serif text-xl mb-2">No papers yet</p>
          <p className="text-sm text-ink-faint mb-6">
            Set your first paper — pick a subject, topics and a marks split,
            and Setter drafts the rest.
          </p>
          <Link
            href="/dashboard/new"
            className="inline-block bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-light transition-colors"
          >
            Create a paper
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-paper-line border-t border-b border-paper-line">
          {list.map((paper) => (
            <PaperListItem key={paper.id} paper={paper} />
          ))}
        </ul>
      )}
    </div>
  );
}
