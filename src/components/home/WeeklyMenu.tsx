import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { readMenu, type MenuItem } from "@/lib/menu-store";

function formatDateRange(weekStart?: string, weekEnd?: string): string {
  if (!weekStart) return "";
  const start = new Date(weekStart);
  const end = weekEnd ? new Date(weekEnd) : null;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "numeric" };
  const s = start.toLocaleDateString("de-DE", opts);
  if (!end) return s;
  return `${s} – ${end.toLocaleDateString("de-DE", opts)}`;
}

function isActiveWeek(item: MenuItem, today: Date): boolean {
  if (!item.weekStart || !item.weekEnd) return false;
  const start = new Date(item.weekStart);
  const end = new Date(item.weekEnd);
  end.setHours(23, 59, 59, 999);
  return today >= start && today <= end;
}

export default async function WeeklyMenu() {
  const items = await readMenu();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const wochenkarte = items
    .filter((i) => i.kategorie === "wochenkarte" && i.weekStart)
    .sort((a, b) => new Date(a.weekStart!).getTime() - new Date(b.weekStart!).getTime());

  // Group by month — show current month, or next month if current is empty
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let monthItems = wochenkarte.filter((i) => {
    const d = new Date(i.weekStart!);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // If no items this month, show next available month
  if (monthItems.length === 0) {
    monthItems = wochenkarte.filter((i) => new Date(i.weekStart!) >= today).slice(0, 4);
  }

  // If still nothing with dates, fall back to plain wochenkarte items
  const displayItems =
    monthItems.length > 0
      ? monthItems
      : items.filter((i) => i.kategorie === "wochenkarte").slice(0, 3);

  const referenceMonth =
    monthItems.length > 0
      ? new Date(monthItems[0].weekStart!).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
      : null;

  const cols =
    displayItems.length === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : displayItems.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
      : displayItems.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel>Frisch & wechselnd</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl text-espresso">
            {referenceMonth ? `Wochenangebote ${referenceMonth}` : "Was kocht diese Woche?"}
          </h2>
        </AnimatedSection>

        <div className={`grid ${cols} gap-6 mb-10`}>
          {displayItems.map((dish, i) => {
            const active = isActiveWeek(dish, today);
            return (
              <AnimatedSection key={dish.id} delay={i * 0.12}>
                <div
                  className={`border rounded-2xl p-6 transition-all duration-300 bg-cream group relative ${
                    active
                      ? "border-terracotta/60 shadow-md ring-1 ring-terracotta/20"
                      : "border-sand hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  {active && (
                    <span className="absolute top-4 right-4 font-dm text-xs text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-full">
                      Diese Woche
                    </span>
                  )}
                  <div
                    className={`h-px bg-terracotta mb-4 transition-all duration-300 ${
                      active ? "w-16" : "w-8 group-hover:w-16"
                    }`}
                  />
                  {dish.weekStart && (
                    <p className="font-dm text-xs text-espresso/40 mb-2 tabular-nums">
                      {formatDateRange(dish.weekStart, dish.weekEnd)}
                    </p>
                  )}
                  <h3 className="font-playfair text-xl text-espresso mb-2">{dish.name}</h3>
                  {dish.description && (
                    <p className="font-dm text-sm text-espresso/60 mb-4 leading-relaxed">
                      {dish.description}
                    </p>
                  )}
                  <p className="font-playfair text-terracotta text-lg font-semibold">{dish.price}</p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="text-center">
          <Button href="/speisekarte" variant="outline">
            Zur vollen Speisekarte →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
