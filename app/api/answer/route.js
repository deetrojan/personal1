import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/session";
import { QUESTIONS, normalizeAnswer } from "@/lib/questions";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (!(await hasValidSession())) {
      return NextResponse.json({ error: "पहले special date से unlock करें।" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const questionId = String(body.questionId ?? "");
    const suppliedAnswer = normalizeAnswer(body.answer);
    const question = QUESTIONS.find((item) => item.id === questionId);

    if (!question || !suppliedAnswer) {
      return NextResponse.json({ error: "सवाल या जवाब मान्य नहीं है।" }, { status: 400 });
    }

    const correct = suppliedAnswer === normalizeAnswer(question.answer);
    return NextResponse.json({ correct });
  } catch {
    return NextResponse.json({ error: "जवाब जाँचने में समस्या हुई।" }, { status: 500 });
  }
}
