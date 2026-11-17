import { readMenu, type MenuItem } from "@/lib/menu-store";
import { todayInBerlin } from "@/lib/dates";
import { isEintopfSeason } from "@/lib/eintopf";
import SectionLabel from "@/components/ui/SectionLabel";

async function getWochenkarte(): Promise<MenuItem[]> {
  const items = await readMenu();
  const wochenkarte = items.filter((i) => i.kategorie === "wochenkarte");
  const todayKey = todayInBerlin();
  const current = wochenkarte
    .filter((i) => i.weekStart && (i.weekEnd ?? i.weekStart) >= todayKey)
    .sort((a, b) => (a.weekStart! < b.weekStart! ? -1 : 1));
  const dishes = current.length > 0 ? current : wochenkarte.filter((i) => !i.weekStart);
  return dishes.slice(0, 3);
}

export default async function WeeklyMenuTeaser() {
  const inSeason = isEintopfSeason(todayInBerlin());
  const dishes = inSeason ? [] : await getWochenkarte();

  if (!inSeason && dishes.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-sand/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>Inklusive für Gäste</SectionLabel>
          <h2 className="font-playfair text-3xl text-espresso mt-2">
            Essen im Trebel Café
          </h2>
          <p className="font-dm text-sm text-espresso/60 mt-3 max-w-md mx-auto">
            {inSeason
              ? "Als Feriengast genießen Sie bis Ende Februar 2027 unsere frisch gekochten Eintöpfe direkt vor Ort."
              : "Als Feriengast genießen Sie unsere aktuellen Wochenangebote direkt vor Ort."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="border border-sand rounded-2xl p-5 bg-cream hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="w-6 h-px bg-terracotta mb-3" />
              <h3 className="font-playfair text-lg text-espresso mb-1">{dish.name}</h3>
              <p className="font-dm text-xs text-espresso/60 leading-relaxed">
                {dish.description}
              </p>
              <p className="font-playfair text-terracotta mt-3 font-semibold">{dish.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
