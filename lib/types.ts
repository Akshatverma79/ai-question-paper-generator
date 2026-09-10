export type QuestionType = "mcq" | "true_false" | "short" | "long" | "fill_blank";

export type Difficulty = "easy" | "medium" | "hard" | "mixed";

export interface GeneratedQuestion {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // mcq only
  answer: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface PaperConfig {
  title: string;
  subject: string;
  gradeLevel: string;
  topics: string;
  totalMarks: number;
  durationMinutes: number;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
  questionCount: number;
  instructions?: string;
}

export interface QuestionPaper {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  grade_level: string | null;
  topics: string | null;
  total_marks: number;
  duration_minutes: number;
  difficulty: Difficulty;
  question_types: QuestionType[];
  questions: GeneratedQuestion[];
  created_at: string;
  updated_at: string;
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Multiple Choice",
  true_false: "True / False",
  short: "Short Answer",
  long: "Long Answer",
  fill_blank: "Fill in the Blank",
};
