import { NextRequest, NextResponse } from "next/server";
import { writeBookings } from "@/lib/bookings-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await writeBookings({ bookings: [] });
  return NextResponse.json({ ok: true });
}
