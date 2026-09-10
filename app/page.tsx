import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <span className="font-serif text-xl tracking-tight">Setter</span>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="hover:text-seal transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
        <div>
          <p className="font-mono text-xs text-seal-dark mb-4">
            Time: flexible &nbsp;·&nbsp; Max Marks: your call
          </p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.08] mb-6">
            Set a question paper the way you'd set it by hand — just faster.
          </h1>
          <p className="text-ink-light/80 text-lg max-w-lg mb-8 leading-relaxed">
            Tell Setter the subject, topics and marks split. It drafts a
            complete paper — question types, difficulty, and an answer key —
            ready to review, edit and export.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="bg-ink text-paper px-6 py-3 hover:bg-ink-light transition-colors"
            >
              Create your first paper
            </Link>
            <Link href="/login" className="underline underline-offset-4 decoration-paper-line hover:decoration-seal">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="border border-paper-line bg-white/60 p-6 relative">
          <div className="absolute -top-3 -right-3 bg-seal text-paper text-xs font-mono px-3 py-1 rotate-3">
            Draft
          </div>
          <p className="font-serif text-lg mb-1">Mid-Term — Physics, Grade 10</p>
          <p className="text-xs text-ink-faint font-mono mb-6">
            25 marks &nbsp;·&nbsp; 5 questions &nbsp;·&nbsp; mixed difficulty
          </p>
          <ol className="space-y-4 text-sm">
            <li className="pb-4 border-b border-paper-line">
              <span className="font-mono text-ink-faint">1. (5 marks)</span>{" "}
              State and explain Newton's second law of motion with one
              real-world example.
            </li>
            <li className="pb-4 border-b border-paper-line">
              <span className="font-mono text-ink-faint">2. (3 marks)</span>{" "}
              Which of the following is a vector quantity?
            </li>
            <li>
              <span className="font-mono text-ink-faint">3. (4 marks)</span>{" "}
              A block of mass 2kg accelerates at 3 m/s². Calculate the net
              force acting on it.
            </li>
          </ol>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-8 border-t border-paper-line pt-12">
        <div>
          <p className="font-serif text-lg mb-2">Fully configurable</p>
          <p className="text-sm text-ink-light/80 leading-relaxed">
            Choose question types, difficulty mix, total marks and duration —
            Setter fits the paper to your syllabus, not the other way round.
          </p>
        </div>
        <div>
          <p className="font-serif text-lg mb-2">Answer key included</p>
          <p className="text-sm text-ink-light/80 leading-relaxed">
            Every generated question comes with a model answer, so grading
            starts the moment the exam ends.
          </p>
        </div>
        <div>
          <p className="font-serif text-lg mb-2">Yours, privately</p>
          <p className="text-sm text-ink-light/80 leading-relaxed">
            Papers are saved to your account only. Revisit, edit or export
            any paper you've generated, any time.
          </p>
        </div>
      </section>
    </main>
  );
}
