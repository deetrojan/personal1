import { NextResponse } from "next/server";
import { makeSessionToken, sessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const expectedDate = process.env.LOVE_DATE_SECRET;
    if (!expectedDate) {
      return NextResponse.json(
        { error: "Website setup incomplete: LOVE_DATE_SECRET is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const suppliedDate = String(body.date ?? "").replace(/\s/g, "");

    if (!/^\d{8}$/.test(suppliedDate)) {
      return NextResponse.json(
        { error: "कृपया तारीख DDMMYYYY format में डालें। 💗" },
        { status: 400 }
      );
    }

    if (suppliedDate !== expectedDate) {
      return NextResponse.json(
        { error: "हम्म… यह हमारी special date नहीं है। फिर से कोशिश करो, मेरी जान। 💕" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookie.name, makeSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: sessionCookie.maxAge
    });
    return response;
  } catch {
    return NextResponse.json({ error: "अभी unlock नहीं हो पाया। बाद में फिर कोशिश करें।" }, { status: 500 });
  }
}
