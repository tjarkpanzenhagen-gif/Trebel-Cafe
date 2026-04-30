import { readFewo } from "@/lib/fewo-store";
import ApartmentCard from "@/components/fewo/ApartmentCard";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ferienwohnungen | Trebelcafé",
  description:
    "Übernachten Sie direkt am Trebelcafé. Zwei gemütliche Ferienwohnungen mit Frühstück inklusive.",
};

export default async function FerienwohnungenPage() {
  const data = await readFewo();

  return (
    <main>
      {/* Hero */}
      <section className="bg-terracotta text-cream py-24 px-6 text-center">
        <SectionLabel light>Übernachten</SectionLabel>
        <h1 className="font-playfair text-4xl md:text-5xl mt-2 mb-4">
          Ferienwohnungen im Trebelcafé
        </h1>
        <p className="font-dm text-cream/80 max-w-md mx-auto text-sm leading-relaxed">
          Zwei gemütliche Wohnungen direkt am Café — wachen Sie auf und genießen Sie unser
          Frühstück.
        </p>
      </section>

      {/* Apartments */}
      <section className="bg-cream">
        {data.apartments.map((apt, i) => (
          <ApartmentCard key={apt.id} apartment={apt} delay={i * 0.1} />
        ))}
      </section>

      {/* Weekly menu teaser */}
      <WeeklyMenuTeaser />
    </main>
  );
}
