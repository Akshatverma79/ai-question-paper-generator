import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/openai";
import type { PaperConfig } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const config = (await request.json()) as PaperConfig;

  if (!config.subject || !config.questionTypes?.length || !config.questionCount) {
    return NextResponse.json(
      { error: "Missing required fields: subject, questionTypes, questionCount" },
      { status: 400 }
    );
  }

  try {
    const questions = await generateQuestions(config);

    const { data, error } = await supabase
      .from("question_papers")
      .insert({
        user_id: user.id,
        title: config.title || `${config.subject} Question Paper`,
        subject: config.subject,
        grade_level: config.gradeLevel || null,
        topics: config.topics || null,
        total_marks: config.totalMarks,
        duration_minutes: config.durationMinutes,
        difficulty: config.difficulty,
        question_types: config.questionTypes,
        questions,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ paper: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate question paper. Please try again." },
      { status: 500 }
    );
  }
}
