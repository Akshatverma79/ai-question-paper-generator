import jsPDF from "jspdf";
import type { QuestionPaper } from "@/lib/types";

function wrap(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadPaperPDF(paper: QuestionPaper, includeAnswers: boolean) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const marginX = 20;
  const maxWidth = 170;
  let y = 20;

  doc.setFont("times", "bold");
  doc.setFontSize(16);
  y = wrap(doc, paper.title, marginX, y, maxWidth, 7);

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  y += 2;
  doc.text(
    `Subject: ${paper.subject}${paper.grade_level ? "   ·   Grade: " + paper.grade_level : ""}`,
    marginX,
    y
  );
  y += 6;
  doc.text(
    `Time: ${paper.duration_minutes} minutes        Max Marks: ${paper.total_marks}`,
    marginX,
    y
  );
  y += 4;
  doc.setDrawColor(180);
  doc.line(marginX, y, 190, y);
  y += 10;

  doc.setFontSize(11);
  paper.questions.forEach((q, i) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("times", "bold");
    y = wrap(doc, `${i + 1}. (${q.marks} marks)`, marginX, y, maxWidth, 6);
    doc.setFont("times", "normal");
    y = wrap(doc, q.text, marginX, y, maxWidth, 6);

    if (q.type === "mcq" && q.options) {
      q.options.forEach((opt, oi) => {
        const letter = String.fromCharCode(97 + oi);
        y = wrap(doc, `   ${letter}) ${opt}`, marginX, y, maxWidth, 5.5);
      });
    }

    if (includeAnswers) {
      doc.setFont("times", "italic");
      doc.setTextColor(120);
      y = wrap(doc, `Answer: ${q.answer}`, marginX, y, maxWidth, 5.5);
      doc.setTextColor(0);
    }

    y += 5;
  });

  const filename = `${paper.title.replace(/[^a-z0-9]+/gi, "_")}${includeAnswers ? "_with_answers" : ""}.pdf`;
  doc.save(filename);
}
