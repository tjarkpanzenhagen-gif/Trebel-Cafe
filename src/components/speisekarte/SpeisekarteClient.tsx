"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import type { MenuItem } from "@/lib/menu-store";

const SECTIONS: { key: MenuItem["kategorie"]; label: string; title: string; note?: string }[] = [
  { key: "fruehstueck", label: "Bis 11:30 Uhr", title: "Frühstück" },
  { key: "fruehstueckExtras", label: "Zum Dazubestellen", title: "Frühstücksextras" },
  { key: "mittagskarte", label: "11:30 – 14:30 Uhr", title: "Kleine Mittagskarte" },
  { key: "kuchenUndGebaeck", label: "Aus unserer Backstube", title: "Kuchen & Gebäck" },
  { key: "wein", label: "Vom Winzer", title: "Wein & Sekt" },
  { key: "heissgetraenke", label: "Mit Hafermilch +0,50 €", title: "Heißgetränke" },
  { key: "softgetraenke", label: "Alkoholfrei", title: "Softgetränke" },
  { key: "bier", label: "Vom Fass & Flasche", title: "Bier" },
  { key: "eisKaltgetraenke", label: "Mit Hafermilch +0,50 €", title: "Eis-Kaltgetränke" },
];

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-sand/60 last:border-b-0 group">
      <div className="min-w-0">
        <span className="font-dm text-sm text-espresso group-hover:text-terracotta transition-colors">
          {item.name}
        </span>
        {item.description && (
          <span className="font-dm text-xs text-espresso/45 ml-2">{item.description}</span>
        )}
      </div>
      <span className="font-playfair text-terracotta text-sm whitespace-nowrap shrink-0">{item.price}</span>
    </div>
  );
}

export default function SpeisekarteClient({ items }: { items: MenuItem[] }) {
  const sectionsWithItems = SECTIONS.map((s) => ({
    ...s,
    items: items.filter((i) => i.kategorie === s.key),
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

            <AnimatedSection>
              <div className="max-w-2xl">
                {section.items.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </div>
            </AnimatedSection>
          </div>
          {idx < sectionsWithItems.length - 1 && <div className="section-divider" />}
        </section>
      ))}

      <AnimatedSection className="py-12 text-center">
        <p className="font-cormorant italic text-xl text-espresso/60">
          Alle Preise inkl. MwSt. — Saisonale Änderungen vorbehalten.
        </p>
      </AnimatedSection>
    </>
  );
}
