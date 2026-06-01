"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import type { MenuItem } from "@/lib/menu-store";

const SECTIONS: { key: MenuItem["kategorie"]; label: string; title: string; note?: string }[] = [
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

            {section.note && (
              <AnimatedSection className="mb-4">
                <p className="font-dm text-sm text-espresso/50 italic">{section.note}</p>
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
