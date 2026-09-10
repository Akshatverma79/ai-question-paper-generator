"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Difficulty, PaperConfig, QuestionType } from "@/lib/types";
import { QUESTION_TYPE_LABELS } from "@/lib/types";

const ALL_TYPES: QuestionType[] = ["mcq", "true_false", "short", "long", "fill_blank"];

export default function PaperForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("Drafting your paper…");

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [topics, setTopics] = useState("");
  const [totalMarks, setTotalMarks] = useState(50);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(["mcq", "short"]);
  const [instructions, setInstructions] = useState("");

  function toggleType(type: QuestionType) {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (questionTypes.length === 0) {
      setError("Pick at least one question type.");
      return;
    }

    setLoading(true);
    const messages = [
      "Drafting your paper…",
      "Balancing the marks across questions…",
      "Writing the answer key…",
      "Almost done…",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = Math.min(i + 1, messages.length - 1);
      setStatusMsg(messages[i]);
    }, 2500);

    const config: PaperConfig = {
      title,
      subject,
      gradeLevel,
      topics,
      totalMarks: Number(totalMarks),
      durationMinutes: Number(durationMinutes),
      difficulty,
      questionTypes,
      questionCount: Number(questionCount),
      instructions,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      router.push(`/dashboard/papers/${data.paper.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    } finally {
      clearInterval(interval);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Paper title (optional)">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mid-Term Examination"
            className="input"
          />
        </Field>
        <Field label="Subject" required>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Physics"
            required
            className="input"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Grade / level (optional)">
          <input
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="e.g. Grade 10"
            className="input"
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            min={10}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className="input"
          />
        </Field>
      </div>

      <Field label="Topics to cover (optional)">
        <textarea
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="e.g. Newton's laws, momentum, energy conservation"
          rows={2}
          className="input resize-none"
        />
      </Field>

      <div>
        <p className="text-xs font-mono text-ink-faint mb-2">Question types</p>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((type) => {
            const active = questionTypes.includes(type);
            return (
              <button
                type="button"
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1.5 text-sm border transition-colors ${
                  active
                    ? "bg-ink text-paper border-ink"
                    : "border-paper-line text-ink-light hover:border-seal"
                }`}
              >
                {QUESTION_TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Number of questions">
          <input
            type="number"
            min={1}
            max={50}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Total marks">
          <input
            type="number"
            min={1}
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            className="input"
          />
        </Field>
        <Field label="Difficulty">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="input"
          >
            <option value="mixed">Mixed</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>
      </div>

      <Field label="Extra instructions (optional)">
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g. Focus on application-based problems, avoid pure definitions"
          rows={2}
          className="input resize-none"
        />
      </Field>

      {error && <p className="text-sm text-rust">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ink text-paper py-3 text-sm hover:bg-ink-light transition-colors disabled:opacity-70"
      >
        {loading ? statusMsg : "Generate paper"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #ddd5c0;
          background: #faf7f0;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: #b8863b;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-mono text-ink-faint mb-1">
        {label} {required && <span className="text-rust">*</span>}
      </span>
      {children}
    </label>
  );
}
