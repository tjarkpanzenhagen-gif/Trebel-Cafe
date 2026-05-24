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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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
      extras,
      message,
      estimatedTotal,
    } = body;

    if (!apartmentId || !checkIn || !checkOut || !name || !email || !phone) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }
    if (!EMAIL_RE.test(String(email))) {
      return NextResponse.json({ error: "Ungültige E-Mail-Adresse" }, { status: 400 });
    }
    if (!DATE_RE.test(String(checkIn)) || !DATE_RE.test(String(checkOut))) {
      return NextResponse.json({ error: "Ungültiges Datumsformat" }, { status: 400 });
    }
    if (String(name).length > 100 || String(phone).length > 50 || String(message ?? "").length > 1000) {
      return NextResponse.json({ error: "Eingabe zu lang" }, { status: 400 });
    }

    const safeExtras = {
      kinderbett: Boolean(extras?.kinderbett),
      aufbettung: Boolean(extras?.aufbettung),
    };

    const data = await readBookings();
    const booking = {
      id: randomUUID(),
      apartmentId: String(apartmentId).slice(0, 50),
      apartmentName: String(apartmentName ?? "").slice(0, 100),
      checkIn: String(checkIn).slice(0, 10),
      checkOut: String(checkOut).slice(0, 10),
      nights: Math.max(0, Math.min(365, Number(nights))),
      name: String(name).slice(0, 100),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 50),
      persons: Math.max(1, Math.min(20, Number(persons))),
      extras: safeExtras,
      message: String(message ?? "").slice(0, 1000),
      estimatedTotal: Math.max(0, Number(estimatedTotal)),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    data.bookings.push(booking);
    await writeBookings(data);
    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Buchung konnte nicht gespeichert werden" }, { status: 500 });
  }
}
