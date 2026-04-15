import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { fullMenu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Speisekarte — Trebelcafé Tribsees",
  description: "Unsere Wochenkarte, selbstgebackener Kuchen, Getränke und Frühstück. Alles frisch und hausgemacht.",
};

function MenuCard({ name, description, price }: { name: string; description: string; price: string }) {
  return (
    <div className="border border-sand rounded-2xl p-6 bg-cream hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
      <div className="w-6 h-px bg-terracotta mb-4 group-hover:w-12 transition-all duration-300" />
      <h3 className="font-playfair text-lg text-espresso mb-2">{name}</h3>
      <p className="font-dm text-sm text-espresso/60 mb-4 leading-relaxed">{description}</p>
      <p className="font-playfair text-terracotta font-semibold">{price}</p>
    </div>
  );
}

function MenuSection({ title, label, items }: { title: string; label: string; items: { name: string; description: string; price: string }[] }) {
  return (
    <section className="py-16">
      <AnimatedSection className="mb-10">
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-playfair text-3xl text-espresso">{title}</h2>
        <div className="w-16 h-px bg-terracotta mt-4" />
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <AnimatedSection key={item.name} delay={i * 0.08}>
            <MenuCard {...item} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export default function SpeisekartePage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <AnimatedSection className="text-center py-16">
          <SectionLabel>Alles selbst gemacht</SectionLabel>
          <h1 className="font-playfair text-5xl md:text-6xl text-espresso mb-4">Speisekarte</h1>
          <p className="font-dm text-espresso/60 max-w-md mx-auto">
            Unsere Wochenkarte wechselt regelmäßig. Alle Gerichte werden frisch zubereitet.
          </p>
        </AnimatedSection>

        <div className="section-divider" />

        <MenuSection
          label="Frisch & wechselnd"
          title="Wochenkarte"
          items={fullMenu.wochenkarte}
        />

        <div className="section-divider" />

        <MenuSection
          label="Aus unserer Backstube"
          title="Kuchen & Gebäck"
          items={fullMenu.kuchenUndGebaeck}
        />

        <div className="section-divider" />

        <MenuSection
          label="Heiß & kalt"
          title="Getränke"
          items={fullMenu.getraenke}
        />

        {/* Note */}
        <AnimatedSection className="py-12 text-center">
          <p className="font-cormorant italic text-xl text-espresso/60">
            Alle Preise inkl. MwSt. — Saisonale Änderungen vorbehalten.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
