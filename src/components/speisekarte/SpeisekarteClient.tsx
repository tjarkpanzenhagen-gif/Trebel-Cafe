"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import type { MenuItem } from "@/lib/menu-store";

const SECTIONS: { key: MenuItem["kategorie"]; label: string; title: string; note?: string }[] = [
  { key: "wochenkarte", label: "Monatsübersicht", title: "Wochenangebote" },
  { key: "fruehstueck", label: "Bis 11:30 Uhr", title: "Frühstück", note: "Getränkeänderung + 1,00 €" },
  { key: "fruehstueckExtras", label: "Zum Dazubestellen", title: "Frühstücksextras" },
  { key: "mittagskarte", label: "11:30 – 14:30 Uhr", title: "Kleine Mittagskarte", note: "Wechselnde Wochenangebote sind beim Personal zu erfragen." },
  { key: "kuchenUndGebaeck", label: "Aus unserer Backstube", title: "Kuchen & Gebäck" },
  { key: "wein", label: "Vom Winzer", title: "Wein & Sekt" },
  { key: "heissgetraenke", label: "Mit Hafermilch +0,50 €", title: "Heißgetränke" },
  { key: "softgetraenke", label: "Alkoholfrei", title: "Softgetränke" },
  { key: "bier", label: "Vom Fass & Flasche", title: "Bier" },
  { key: "eisKaltgetraenke", label: "Mit Hafermilch +0,50 €", title: "Eis-Kaltgetränke" },
];

function formatDateRange(weekStart?: string, weekEnd?: string): string {
  if (!weekStart) return "";
  const start = new Date(weekStart);
  const end = weekEnd ? new Date(weekEnd) : null;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric" };
  const s = start.toLocaleDateString("de-DE", opts);
  if (!end) return s;
  return `${s} – ${end.toLocaleDateString("de-DE", opts)}`;
}

const MONTH_NAMES = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function isInCurrentMonth(item: MenuItem): boolean {
  if (!item.weekStart) return true;
  const current = monthKey(new Date());
  const startMonth = item.weekStart.slice(0, 7);
  const endMonth = (item.weekEnd ?? item.weekStart).slice(0, 7);
  return startMonth <= current && endMonth >= current;
}

function isInNextMonth(item: MenuItem): boolean {
  if (!item.weekStart) return false;
  const now = new Date();
  const next = monthKey(new Date(now.getFullYear(), now.getMonth() + 1, 1));
  return item.weekStart.slice(0, 7) === next;
}

function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isActiveWeek(item: MenuItem): boolean {
  if (!item.weekStart || !item.weekEnd) return false;
  const todayKey = localDateKey(new Date());
  return item.weekStart <= todayKey && todayKey <= item.weekEnd;
}

function WeekRow({ item }: { item: MenuItem }) {
  const active = isActiveWeek(item);
  const dateLabel = formatDateRange(item.weekStart, item.weekEnd);

  return (
    <div
      className={`flex items-start justify-between gap-4 py-3 border-b border-sand/60 last:border-b-0 group ${
        active ? "relative" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`font-dm text-sm transition-colors ${
              active ? "text-terracotta font-medium" : "text-espresso group-hover:text-terracotta"
            }`}
          >
            {item.name}
          </p>
          {active && (
            <span className="font-dm text-xs text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
              Diese Woche
            </span>
          )}
        </div>
        {dateLabel && (
          <p className="font-dm text-xs text-espresso/40 mt-0.5 tabular-nums">{dateLabel}</p>
        )}
        {item.description && (
          <p className="font-dm text-xs text-espresso/45 mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>
      <span className="font-playfair text-terracotta text-sm whitespace-nowrap shrink-0 pt-0.5">
        {item.price}
      </span>
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-sand/60 last:border-b-0 group">
      <div className="min-w-0">
        <p className="font-dm text-sm text-espresso group-hover:text-terracotta transition-colors">
          {item.name}
        </p>
        {item.description && (
          <p className="font-dm text-xs text-espresso/45 mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>
      <span className="font-playfair text-terracotta text-sm whitespace-nowrap shrink-0 pt-0.5">{item.price}</span>
    </div>
  );
}

export default function SpeisekarteClient({ items }: { items: MenuItem[] }) {
  const now = new Date();
  const nextMonthName = MONTH_NAMES[(now.getMonth() + 1) % 12];
  const nextMonthItems = items.filter((i) => i.kategorie === "wochenkarte" && isInNextMonth(i));

  const sectionsWithItems = SECTIONS.map((s) => ({
    ...s,
    items: items
      .filter((i) => i.kategorie === s.key)
      .filter((i) => s.key !== "wochenkarte" || isInCurrentMonth(i)),
  })).filter((s) => s.items.length > 0);

  return (
    <>
      {sectionsWithItems.map((section, idx) => (
        <section key={section.key}>
          <div className="py-12">
            <AnimatedSection className="mb-6">
              <SectionLabel>{section.label}</SectionLabel>
              <h2 className="font-playfair text-3xl text-espresso">{section.title}</h2>
              <div className="w-12 h-px bg-terracotta mt-3" />
            </AnimatedSection>

            {section.key === "wochenkarte" && (
              <AnimatedSection className="mb-6">
                <div className="flex items-start gap-3 bg-sand/40 border border-sand rounded-2xl px-6 py-5">
                  <div>
                    <p className="font-playfair text-espresso font-semibold mb-1">Frisch & wechselnd</p>
                    <p className="font-dm text-sm text-espresso/70 leading-relaxed">
                      Jede Woche gibt es ein wechselndes Tagesangebot. Preise können je nach Saison und Verfügbarkeit leicht variieren — sprecht uns gerne an!
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {section.key === "kuchenUndGebaeck" && (
              <AnimatedSection className="mb-6">
                <div className="flex items-start gap-3 bg-terracotta/8 border border-terracotta/20 rounded-2xl px-6 py-5">
                  <div>
                    <p className="font-playfair text-espresso font-semibold mb-1">Frisch aus unserer Backstube</p>
                    <p className="font-dm text-sm text-espresso/70 leading-relaxed">
                      Unsere Torten & Blechkuchen werden täglich frisch gebacken. Welche Sorten heute in der Auslage stehen, siehst du am besten vor Ort.
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {section.note && (
              <AnimatedSection className="mb-4">
                <p className="font-dm text-sm text-espresso/50 italic">{section.note}</p>
              </AnimatedSection>
            )}

            <AnimatedSection>
              <div className="max-w-2xl">
                {section.items.map((item) =>
                  section.key === "wochenkarte" ? (
                    <WeekRow key={item.id} item={item} />
                  ) : (
                    <MenuRow key={item.id} item={item} />
                  )
                )}
              </div>
            </AnimatedSection>

            {section.key === "wochenkarte" && nextMonthItems.length > 0 && (
              <AnimatedSection className="mt-8">
                <div className="max-w-2xl">
                  <p className="font-playfair text-base text-espresso/50 mb-3">Ab {nextMonthName}</p>
                  <div className="opacity-60">
                    {nextMonthItems.map((item) => (
                      <WeekRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
          {idx < sectionsWithItems.length - 1 && <div className="section-divider" />}
        </section>
      ))}

      <AnimatedSection className="py-12 text-center space-y-3">
        <p className="font-cormorant italic text-xl text-espresso/60">
          Alle Preise inkl. MwSt. — Saisonale Änderungen vorbehalten.
        </p>
        <p className="font-dm text-sm text-espresso/40">
          Zusatzstoffe und Allergene sind beim Personal zu erfragen.
        </p>
      </AnimatedSection>
    </>
  );
}
