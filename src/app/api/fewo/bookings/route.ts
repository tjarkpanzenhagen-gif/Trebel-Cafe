import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readBookings, writeBookings } from "@/lib/bookings-store";

function isAuthenticated(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
  return request.cookies.get("admin_session")?.value === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await readBookings();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      apartmentId,
      apartmentName,
      checkIn,
      checkOut,
      nights,
      name,
      email,
      phone,
      persons,
      extraBeds,
      message,
      estimatedTotal,
    } = body;

    if (!apartmentId || !checkIn || !checkOut || !name || !email || !phone) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }

    const data = await readBookings();
    const booking = {
      id: randomUUID(),
      apartmentId,
      apartmentName,
      checkIn,
      checkOut,
      nights: Number(nights),
      name,
      email,
      phone,
      persons: Number(persons),
      extraBeds: Number(extraBeds),
      message: message || "",
      estimatedTotal: Number(estimatedTotal),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    data.bookings.push(booking);
    await writeBookings(data);
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
