import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readBookings, writeBookings } from "@/lib/bookings-store";
import type { BookingStatus } from "@/lib/bookings-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { status } = await request.json();
    const allowed: BookingStatus[] = ["confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }
    const data = await readBookings();
    const index = data.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
    }
    data.bookings[index].status = status;
    await writeBookings(data);
    revalidatePath("/ferienwohnungen", "layout");
    return NextResponse.json(data.bookings[index]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
