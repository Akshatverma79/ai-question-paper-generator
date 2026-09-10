"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { QuestionPaper } from "@/lib/types";

export default function PaperListItem({ paper }: { paper: QuestionPaper }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm(`Delete "${paper.title}"? This can't be undone.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/papers/${paper.id}`, { method: "DELETE" });
    setDeleting(false);

    if (res.ok) router.refresh();
    else alert("Couldn't delete this paper. Please try again.");
  }

  const date = new Date(paper.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <li>
      <Link
        href={`/dashboard/papers/${paper.id}`}
        className="flex items-center justify-between py-5 group hover:bg-paper-dim/60 transition-colors -mx-2 px-2"
      >
        <div>
          <p className="font-serif text-lg group-hover:text-seal-dark transition-colors">
            {paper.title}
          </p>
          <p className="text-xs text-ink-faint font-mono mt-1">
            {paper.subject} &nbsp;·&nbsp; {paper.total_marks} marks &nbsp;·&nbsp;{" "}
            {paper.questions?.length ?? 0} questions &nbsp;·&nbsp; {date}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-ink-faint hover:text-rust transition-colors opacity-0 group-hover:opacity-100"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </Link>
    </li>
  );
}
