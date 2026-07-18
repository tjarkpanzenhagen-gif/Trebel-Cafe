import { closurePeriods } from "@/lib/content";

export function todayInBerlin(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getClosedDayReason(date: string): string | null {
  const weekday = new Date(date + "T12:00:00").getDay();
  if (weekday === 2 || weekday === 3) {
    return "An diesem Tag hat das Café Ruhetag (Dienstag & Mittwoch geschlossen).";
  }
  if (closurePeriods.some((p) => date >= p.from && date <= p.to)) {
    return "Das Café ist in diesem Zeitraum geschlossen (Schließzeit).";
  }
  return null;
}
