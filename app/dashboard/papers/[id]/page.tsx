import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { QuestionPaper } from "@/lib/types";
import PaperView from "@/components/PaperView";

export default async function PaperPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: paper } = await supabase
    .from("question_papers")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user?.id ?? "")
    .single();

  if (!paper) notFound();

  return <PaperView paper={paper as QuestionPaper} />;
}
