import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/session";
import { QUESTIONS, publicQuestion } from "@/lib/questions";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!(await hasValidSession())) {
      return NextResponse.json({ error: "पहले special date से unlock करें।" }, { status: 401 });
    }

    // Always return the same fixed question.
    return NextResponse.json({ question: publicQuestion(QUESTIONS[0]) });
  } catch {
    return NextResponse.json({ error: "सवाल लाने में समस्या हुई।" }, { status: 500 });
  }
}
