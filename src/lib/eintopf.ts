export const EINTOPF_FROM = "2026-12-01";
export const EINTOPF_UNTIL = "2027-02-28";
const EINTOPF_TEASER_FROM = "2026-11-01";

export function isEintopfSeason(dateKey: string): boolean {
  return dateKey >= EINTOPF_FROM && dateKey <= EINTOPF_UNTIL;
}

export function isEintopfUpcoming(dateKey: string): boolean {
  return dateKey >= EINTOPF_TEASER_FROM && dateKey < EINTOPF_FROM;
}
