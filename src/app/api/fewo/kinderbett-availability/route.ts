import { NextRequest, NextResponse } from "next/server";
import { readBookings, getKinderbettBookedPeriods } from "@/lib/bookings-store";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut || !DATE_RE.test(checkIn) || !DATE_RE.test(checkOut)) {
    return NextResponse.json(
      { error: "checkIn und checkOut erforderlich (JJJJ-MM-TT)" },
      { status: 400 }
    );
  }

  const { bookings } = await readBookings();
  const periods = getKinderbettBookedPeriods(bookings);

  let latestConflictEnd: string | null = null;
  for (const period of periods) {
    if (period.checkIn < checkOut && period.checkOut > checkIn) {
      if (!latestConflictEnd || period.checkOut > latestConflictEnd) {
        latestConflictEnd = period.checkOut;
      }
    }
  }

  if (latestConflictEnd) {
    return NextResponse.json({
      available: false,
      nextAvailableDate: latestConflictEnd,
    });
  }
  return NextResponse.json({ available: true });
}
