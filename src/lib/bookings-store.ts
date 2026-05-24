export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  apartmentId: string;
  apartmentName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  name: string;
  email: string;
  phone: string;
  persons: number;
  extras: { kinderbett: boolean; aufbettung: boolean };
  message: string;
  estimatedTotal: number;
  status: BookingStatus;
  createdAt: string;
};

export type BookingsData = {
  bookings: Booking[];
};

const KV_KEY = "trebelcafe_bookings";
const KV_URL = process.env.trebelcafe_KV_REST_API_URL;
const KV_TOKEN = process.env.trebelcafe_KV_REST_API_TOKEN;

function hasKVCredentials() {
  return Boolean(KV_URL && KV_TOKEN);
}

async function getKV() {
  const { createClient } = await import("@vercel/kv");
  return createClient({ url: KV_URL!, token: KV_TOKEN! });
}

function normalizeBooking(b: Booking): Booking {
  return {
    ...b,
    extras: b.extras ?? { kinderbett: false, aufbettung: false },
  };
}

export async function readBookings(): Promise<BookingsData> {
  if (hasKVCredentials()) {
    try {
      const kv = await getKV();
      const data = await kv.get<BookingsData>(KV_KEY);
      const result = data ?? { bookings: [] };
      return { bookings: result.bookings.map(normalizeBooking) };
    } catch {
      return { bookings: [] };
    }
  }
  if (!process.env.VERCEL) {
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    try {
      const data: BookingsData = JSON.parse(
        readFileSync(join(process.cwd(), "data", "bookings.json"), "utf-8")
      );
      return { bookings: data.bookings.map(normalizeBooking) };
    } catch {
      return { bookings: [] };
    }
  }
  return { bookings: [] };
}

export async function writeBookings(data: BookingsData): Promise<void> {
  if (hasKVCredentials()) {
    const kv = await getKV();
    await kv.set(KV_KEY, data);
    return;
  }
  if (!process.env.VERCEL) {
    const { writeFileSync } = await import("fs");
    const { join } = await import("path");
    writeFileSync(join(process.cwd(), "data", "bookings.json"), JSON.stringify(data, null, 2));
    return;
  }
  throw new Error("KV credentials fehlen.");
}

export function getBookedDatesForApartment(bookings: Booking[], apartmentId: string): string[] {
  const dates = new Set<string>();
  bookings
    .filter((b) => b.apartmentId === apartmentId && (b.status === "pending" || b.status === "confirmed"))
    .forEach((b) => {
      const start = new Date(b.checkIn + "T00:00:00Z");
      const end = new Date(b.checkOut + "T00:00:00Z");
      for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
        dates.add(d.toISOString().slice(0, 10));
      }
    });
  return Array.from(dates);
}

export function getKinderbettBookedPeriods(
  bookings: Booking[]
): Array<{ checkIn: string; checkOut: string }> {
  return bookings
    .filter(
      (b) =>
        (b.status === "pending" || b.status === "confirmed") &&
        b.extras.kinderbett
    )
    .map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut }));
}
