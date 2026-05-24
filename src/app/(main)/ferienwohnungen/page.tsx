import { readFewo } from "@/lib/fewo-store";
import ApartmentCard from "@/components/fewo/ApartmentCard";
import WeeklyMenuTeaser from "@/components/fewo/WeeklyMenuTeaser";
import SectionLabel from "@/components/ui/SectionLabel";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
      <section className="bg-espresso text-cream py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-terracotta/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative">
          <SectionLabel light>Übernachten in Tribsees</SectionLabel>
          <h1 className="font-playfair text-4xl md:text-5xl mt-2 mb-4">
            Ferienwohnungen<br className="hidden md:block" /> im Trebelcafé
          </h1>
          <p className="font-dm text-cream/65 max-w-md mx-auto text-sm leading-relaxed">
            Wachen Sie auf und genießen Sie frisches Gebäck, selbstgemachte Marmelade und
            starken Kaffee — direkt vor Ihrer Tür.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-10">
            <div className="text-center">
              <p className="font-playfair text-3xl text-terracotta">2</p>
              <p className="font-dm text-xs text-cream/40 uppercase tracking-widest mt-1">Wohnungen</p>
            </div>
            <div className="w-px h-10 bg-cream/15" />
            <div className="text-center">
              <p className="font-playfair text-3xl text-terracotta">
                ab {Math.min(...data.apartments.map((a) => a.pricing.perNight))} €
              </p>
              <p className="font-dm text-xs text-cream/40 uppercase tracking-widest mt-1">pro Nacht</p>
            </div>
            <div className="w-px h-10 bg-cream/15" />
            <div className="text-center">
              <p className="font-playfair text-3xl text-terracotta">inkl.</p>
              <p className="font-dm text-xs text-cream/40 uppercase tracking-widest mt-1">Frühstück</p>
            </div>
          </div>
        </div>
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
