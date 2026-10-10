import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "love_quiz_session";
const SESSION_SECONDS = 60 * 60 * 12;

function sessionSecret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32 || value.includes("replace-with-")) {
    throw new Error("SESSION_SECRET is missing or too weak. Set a random secret of at least 32 characters.");
  }
  return value;
}

function sign(value) {
  return createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

export function makeSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, suppliedSignature] = parts;
  const expectedSignature = sign(payload);

  try {
    const supplied = Buffer.from(suppliedSignature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      return false;
    }
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number.isFinite(data.exp) && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function hasValidSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const sessionCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_SECONDS
};
