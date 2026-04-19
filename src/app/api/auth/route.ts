import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ ok: true });
}
