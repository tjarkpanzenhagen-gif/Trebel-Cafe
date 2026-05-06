import type { MenuItem } from "@/lib/menu-store";
import SectionLabel from "@/components/ui/SectionLabel";

async function getWochenkarte(): Promise<MenuItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/menu`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const items: MenuItem[] = await res.json();
    return items.filter((i) => i.kategorie === "wochenkarte").slice(0, 3);
  } catch {
    return [];
  }
}

export default async function WeeklyMenuTeaser() {
  const dishes = await getWochenkarte();

  if (dishes.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-sand/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>Inklusive für Gäste</SectionLabel>
          <h2 className="font-playfair text-3xl text-espresso mt-2">
            Essen im Trebelcafé
          </h2>
          <p className="font-dm text-sm text-espresso/60 mt-3 max-w-md mx-auto">
            Als Feriengast genießen Sie unsere aktuellen Wochenangebote direkt vor Ort.
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
