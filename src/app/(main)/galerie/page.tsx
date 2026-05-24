import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Galerie — Trebel Café Tribsees",
  description: "Bilder aus dem Trebel Café — Atmosphäre, Kuchen und gemütliche Momente.",
};

export default function GaleriePage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-12">
          <SectionLabel>Einblicke</SectionLabel>
          <h1 className="font-playfair text-5xl text-espresso mb-4">Galerie</h1>
          <p className="font-dm text-espresso/60 max-w-sm mx-auto">
            Atmosphäre, Kuchen und gemütliche Momente aus dem Trebel Café.
          </p>
        </AnimatedSection>

        <div className="py-20 text-center">
          <p className="font-playfair text-2xl text-espresso/20 mb-2">Bilder folgen</p>
          <p className="font-dm text-sm text-espresso/30">Wir füllen die Galerie demnächst mit Leben.</p>
        </div>
      </div>
    </div>
  );
}
