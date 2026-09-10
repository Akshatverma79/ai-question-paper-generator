import OpenAI from "openai";
import type { GeneratedQuestion, PaperConfig } from "@/lib/types";

// Groq exposes an OpenAI-compatible Chat Completions API, so we reuse the
// official `openai` SDK and just point it at Groq's base URL with a Groq key.
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are an expert exam-paper setter. You write clear, curriculum-appropriate
exam questions and always return strict JSON only, with no prose, no markdown fences, and no commentary.`;

function buildUserPrompt(config: PaperConfig): string {
  return `Create a question paper with the following specification:

Subject: ${config.subject}
Grade / level: ${config.gradeLevel || "Not specified"}
Topics to cover: ${config.topics || "General coverage of the subject"}
Total marks: ${config.totalMarks}
Number of questions: ${config.questionCount}
Allowed question types: ${config.questionTypes.join(", ")}
Difficulty: ${config.difficulty}
Extra instructions: ${config.instructions || "None"}

Rules:
- Distribute the ${config.totalMarks} total marks sensibly across all ${config.questionCount} questions (integers only).
- Only use question types from the allowed list above.
- For "mcq" questions, include exactly 4 plausible options in "options", and put the correct option's exact text in "answer".
- For "true_false" questions, "answer" must be exactly "True" or "False", and "options" must be omitted.
- For "short" and "long" questions, "answer" is a concise model answer, and "options" must be omitted.
- For "fill_blank" questions, use "_____" in "text" to mark the blank, and "answer" is the missing word/phrase.
- If difficulty is "mixed", vary each question's individual "difficulty" across easy/medium/hard.
- Otherwise, set every question's "difficulty" to the requested difficulty.
- Number questions implicitly by array order — do not prefix "text" with "Q1." etc.

Return ONLY a JSON object of this exact shape, nothing else:
{
  "questions": [
    {
      "type": "mcq" | "true_false" | "short" | "long" | "fill_blank",
      "text": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string",
      "marks": number,
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}`;
}

export async function generateQuestions(
  config: PaperConfig
): Promise<GeneratedQuestion[]> {
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(config) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from Groq");

  // Models occasionally wrap JSON in a fenced code block despite instructions —
  // strip that before parsing, just in case.
  const cleaned = raw.replace(/^```json\s*|```$/g, "").trim();
  const parsed = JSON.parse(cleaned) as { questions: Omit<GeneratedQuestion, "id">[] };

  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("Model returned no questions");
  }

  return parsed.questions.map((q, i) => ({
    ...q,
    id: `${Date.now()}-${i}`,
  }));
}
