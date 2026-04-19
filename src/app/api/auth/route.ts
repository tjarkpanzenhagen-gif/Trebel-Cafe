import { NextResponse } from "next/server";

function getEnv(key: string, fallback: string) {
  return process.env[key] || fallback;
}

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const validUser = getEnv("ADMIN_USERNAME", "admin");
  const validPass = getEnv("ADMIN_PASSWORD", "changeme");
  const sessionSecret = getEnv("ADMIN_SESSION_SECRET", "dev-secret-change-in-production");

  if (username !== validUser || password !== validPass) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten" },
      { status: 401 }
    );
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", sessionSecret, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_session");
  return response;
}
