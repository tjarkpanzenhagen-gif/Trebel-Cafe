import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  safeEqual,
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
} from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  if (!rateLimit(`auth:${clientIp(request)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Zu viele Anmeldeversuche. Bitte später erneut versuchen." },
      { status: 429 }
    );
  }

  const credentials = getAdminCredentials();
  const token = createSessionToken();
  if (!credentials || !token) {
    return NextResponse.json(
      { error: "Admin-Login ist nicht konfiguriert" },
      { status: 503 }
    );
  }

  let username = "";
  let password = "";
  try {
    const body = await request.json();
    username = String(body?.username ?? "");
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const valid =
    safeEqual(username, credentials.username) &&
    safeEqual(password, credentials.password);
  if (!valid) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
