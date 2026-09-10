import PaperForm from "@/components/PaperForm";

export default function NewPaperPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl mb-1">Set a new paper</h1>
      <p className="text-sm text-ink-faint mb-8">
        Fill in the specification below. Setter will draft the questions and
        an answer key — you can edit anything afterwards.
      </p>
      <PaperForm />
    </div>
  );
}
