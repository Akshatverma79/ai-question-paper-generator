"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { downloadPaperPDF } from "@/lib/pdf";
import type { GeneratedQuestion, QuestionPaper } from "@/lib/types";
import { QUESTION_TYPE_LABELS } from "@/lib/types";

export default function PaperView({ paper: initialPaper }: { paper: QuestionPaper }) {
  const supabase = createClient();
  const [paper, setPaper] = useState(initialPaper);
  const [showAnswers, setShowAnswers] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateQuestion(id: string, patch: Partial<GeneratedQuestion>) {
    setPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from("question_papers")
      .update({ questions: paper.questions })
      .eq("id", paper.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setEditing(false);
    } else {
      alert("Couldn't save changes. Please try again.");
    }
  }

  const usedMarks = paper.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-ink-faint hover:text-seal-dark transition-colors">
        ← Back to papers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl mb-1">{paper.title}</h1>
          <p className="text-xs text-ink-faint font-mono">
            {paper.subject}
            {paper.grade_level ? ` · ${paper.grade_level}` : ""} · {paper.duration_minutes} min ·{" "}
            {usedMarks}/{paper.total_marks} marks · {paper.questions.length} questions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAnswers((s) => !s)}
            className="border border-paper-line px-3 py-2 text-xs hover:border-seal transition-colors"
          >
            {showAnswers ? "Hide answer key" : "Show answer key"}
          </button>
          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            disabled={saving}
            className="border border-paper-line px-3 py-2 text-xs hover:border-seal transition-colors disabled:opacity-60"
          >
            {editing ? (saving ? "Saving…" : "Save changes") : "Edit questions"}
          </button>
          <button
            onClick={() => downloadPaperPDF(paper, false)}
            className="bg-ink text-paper px-3 py-2 text-xs hover:bg-ink-light transition-colors"
          >
            Export PDF
          </button>
          <button
            onClick={() => downloadPaperPDF(paper, true)}
            className="border border-ink px-3 py-2 text-xs hover:bg-ink hover:text-paper transition-colors"
          >
            Export with answers
          </button>
        </div>
      </div>

      {saved && <p className="text-sm text-moss mb-4">Changes saved.</p>}

      <ol className="space-y-6 bg-white/50 border border-paper-line p-6 sm:p-10 bg-ruled">
        {paper.questions.map((q, i) => (
          <li key={q.id} className="pb-6 border-b border-paper-line last:border-0 last:pb-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-mono text-xs text-ink-faint shrink-0">
                {i + 1}.
              </span>
              <span className="font-mono text-xs text-seal-dark shrink-0">
                {QUESTION_TYPE_LABELS[q.type]}
              </span>
              {editing ? (
                <input
                  type="number"
                  value={q.marks}
                  onChange={(e) => updateQuestion(q.id, { marks: Number(e.target.value) })}
                  className="ml-auto w-16 border border-paper-line bg-paper px-2 py-1 text-xs"
                />
              ) : (
                <span className="ml-auto font-mono text-xs text-ink-faint">{q.marks} marks</span>
              )}
            </div>

            {editing ? (
              <textarea
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                rows={2}
                className="w-full border border-paper-line bg-paper px-3 py-2 text-sm mb-2"
              />
            ) : (
              <p className="text-[15px] leading-relaxed mb-2">{q.text}</p>
            )}

            {q.type === "mcq" && q.options && (
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mb-2 pl-1">
                {q.options.map((opt, oi) => (
                  <li key={oi} className="text-sm text-ink-light/90">
                    <span className="font-mono text-ink-faint">
                      {String.fromCharCode(97 + oi)})
                    </span>{" "}
                    {opt}
                  </li>
                ))}
              </ul>
            )}

            {showAnswers &&
              (editing ? (
                <input
                  value={q.answer}
                  onChange={(e) => updateQuestion(q.id, { answer: e.target.value })}
                  className="w-full border border-seal/50 bg-paper-dim px-3 py-1.5 text-sm italic"
                />
              ) : (
                <p className="text-sm text-moss italic bg-paper-dim inline-block px-2 py-1">
                  Answer: {q.answer}
                </p>
              ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
