import type { Metadata } from "next";
import { readMenu } from "@/lib/menu-store";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import SpeisekarteClient from "@/components/speisekarte/SpeisekarteClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Speisekarte | Trebel Café",
  description: "Unsere Wochenkarte, Kuchen & Gebäck und Getränke im Trebel Café Tribsees.",
  alternates: { canonical: "/speisekarte" },
};

export default async function SpeisekartePage() {
  const items = await readMenu();

  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-16">
          <SectionLabel>Alles selbst gemacht</SectionLabel>
          <h1 className="font-playfair text-5xl md:text-6xl text-espresso mb-4">Speisekarte</h1>
          <p className="font-dm text-espresso/60 max-w-md mx-auto">
            Unsere Wochenkarte wechselt regelmäßig. Alle Gerichte werden frisch zubereitet.
          </p>
        </AnimatedSection>

        <SpeisekarteClient items={items} />
      </div>
    </div>
  );
}
