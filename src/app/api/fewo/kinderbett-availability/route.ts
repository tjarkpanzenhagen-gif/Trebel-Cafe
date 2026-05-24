import { NextRequest, NextResponse } from "next/server";
import { readBookings, getKinderbettBookedPeriods } from "@/lib/bookings-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn und checkOut erforderlich" },
      { status: 400 }
    );
  }

  const { bookings } = await readBookings();
  const periods = getKinderbettBookedPeriods(bookings);

  const reqStart = new Date(checkIn);
  const reqEnd = new Date(checkOut);

  let latestConflictEnd: Date | null = null;

  for (const period of periods) {
    const periodStart = new Date(period.checkIn);
    const periodEnd = new Date(period.checkOut);
    if (reqStart < periodEnd && reqEnd > periodStart) {
      if (!latestConflictEnd || periodEnd > latestConflictEnd) {
        latestConflictEnd = periodEnd;
      }
    }
  }

  if (latestConflictEnd) {
    return NextResponse.json({
      available: false,
      nextAvailableDate: latestConflictEnd.toISOString().slice(0, 10),
    });
  }
  return NextResponse.json({ available: true });
}
