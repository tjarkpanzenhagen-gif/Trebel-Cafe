import { NextResponse } from "next/server";

const USERNAME = "123";
const PASSWORD = "123";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (username !== USERNAME || password !== PASSWORD) {
    return NextResponse.json(
      { error: "Ungültige Anmeldedaten" },
      { status: 401 }
    );
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "1", {
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
