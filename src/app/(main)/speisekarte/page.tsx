"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  vegan: boolean;
  vegetarisch: boolean;
  glutenfrei: boolean;
  kategorie: "wochenkarte" | "kuchenUndGebaeck" | "getraenke";
};

type Filter = "vegan" | "vegetarisch" | "glutenfrei";

const SECTIONS = [
  {
    key: "wochenkarte" as const,
    label: "Frisch & wechselnd",
    title: "Wochenkarte",
  },
  {
    key: "kuchenUndGebaeck" as const,
    label: "Aus unserer Backstube",
    title: "Kuchen & Gebäck",
  },
  {
    key: "getraenke" as const,
    label: "Heiß & kalt",
    title: "Getränke",
  },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "vegan", label: "Vegan" },
  { key: "vegetarisch", label: "Vegetarisch" },
  { key: "glutenfrei", label: "Glutenfrei" },
];

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-dm px-2 py-0.5 rounded-full bg-sage/15 text-sage border border-sage/25">
      {label}
    </span>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="border border-sand rounded-2xl p-6 bg-cream hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col gap-3">
      <div>
        <div className="w-6 h-px bg-terracotta mb-4 group-hover:w-12 transition-all duration-300" />
        <h3 className="font-playfair text-lg text-espresso mb-2">{item.name}</h3>
        <p className="font-dm text-sm text-espresso/60 leading-relaxed">{item.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <p className="font-playfair text-terracotta font-semibold">{item.price}</p>
        <div className="flex gap-1 flex-wrap justify-end">
          {item.vegan && <Badge label="Vegan" />}
          {item.vegetarisch && !item.vegan && <Badge label="Vegetarisch" />}
          {item.glutenfrei && <Badge label="Glutenfrei" />}
        </div>
      </div>
    </div>
  );
}

export default function SpeisekartePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<Set<Filter>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  function toggleFilter(filter: Filter) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        next.add(filter);
      }
      return next;
    });
  }

  function getFilteredItems(kategorie: MenuItem["kategorie"]) {
    const categoryItems = items.filter((i) => i.kategorie === kategorie);
    if (activeFilters.size === 0) return categoryItems;
    return categoryItems.filter((item) =>
      [...activeFilters].some((f) => item[f])
    );
  }

  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-16">
          <SectionLabel>Alles selbst gemacht</SectionLabel>
          <h1 className="font-playfair text-5xl md:text-6xl text-espresso mb-4">
            Speisekarte
          </h1>
          <p className="font-dm text-espresso/60 max-w-md mx-auto">
            Unsere Wochenkarte wechselt regelmäßig. Alle Gerichte werden frisch zubereitet.
          </p>
        </AnimatedSection>

        {/* Filter bar */}
        <div className="flex items-center justify-center gap-2 pb-8 flex-wrap">
          <button
            onClick={() => setActiveFilters(new Set())}
            className={`px-4 py-1.5 rounded-full font-dm text-sm transition-colors border ${
              activeFilters.size === 0
                ? "bg-terracotta text-white border-terracotta"
                : "border-sand text-espresso/60 hover:border-terracotta hover:text-terracotta"
            }`}
          >
            Alle
          </button>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`px-4 py-1.5 rounded-full font-dm text-sm transition-colors border ${
                activeFilters.has(key)
                  ? "bg-terracotta text-white border-terracotta"
                  : "border-sand text-espresso/60 hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="section-divider" />

        {loading ? (
          <div className="py-24 text-center font-dm text-espresso/40">Lädt…</div>
        ) : (
          SECTIONS.map((section, sectionIndex) => {
            const sectionItems = getFilteredItems(section.key);
            if (sectionItems.length === 0) return null;
            return (
              <section key={section.key}>
                <div className="py-16">
                  <AnimatedSection className="mb-10">
                    <SectionLabel>{section.label}</SectionLabel>
                    <h2 className="font-playfair text-3xl text-espresso">
                      {section.title}
                    </h2>
                    <div className="w-16 h-px bg-terracotta mt-4" />
                  </AnimatedSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionItems.map((item, i) => (
                      <AnimatedSection key={item.id} delay={i * 0.08}>
                        <MenuCard item={item} />
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
                {sectionIndex < SECTIONS.length - 1 && (
                  <div className="section-divider" />
                )}
              </section>
            );
          })
        )}

        <AnimatedSection className="py-12 text-center">
          <p className="font-cormorant italic text-xl text-espresso/60">
            Alle Preise inkl. MwSt. — Saisonale Änderungen vorbehalten.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
