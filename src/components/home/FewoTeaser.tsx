import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { readFewo } from "@/lib/fewo-store";

const PLACEHOLDER_COLORS = [
  ["bg-[#C8B89A]", "bg-[#BFB090]"],
  ["bg-[#D4C4AC]", "bg-[#C0AD95]"],
];

export default async function FewoTeaser() {
  const data = await readFewo();
  const apartments = data.apartments.slice(0, 2);

  return (
    <section className="py-20 px-6 bg-espresso text-cream">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel light>Übernachten</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl mb-4">
            Schlafen direkt am Café
          </h2>
          <p className="font-dm text-cream/60 max-w-sm mx-auto text-sm leading-relaxed">
            Zwei gemütliche Ferienwohnungen — wachen Sie auf und genießen Sie unser Frühstück.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {apartments.map((apt, i) => (
            <AnimatedSection key={apt.id} delay={i * 0.15}>
              <Link href={`/ferienwohnungen/${apt.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden border border-cream/10 hover:border-terracotta/40 transition-colors duration-300">
                  {/* Image placeholder */}
                  <div className="grid grid-cols-3 gap-0.5 h-44">
                    <div className={`${PLACEHOLDER_COLORS[i % 2][0]} col-span-2 flex items-center justify-center`}>
                      <span className="font-dm text-xs text-espresso/30">Fotos folgen</span>
                    </div>
                    <div className={`${PLACEHOLDER_COLORS[i % 2][1]}`} />
                  </div>
                  {/* Info */}
                  <div className="p-5 bg-espresso/60">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-playfair text-xl text-cream group-hover:text-terracotta transition-colors">
                        {apt.name}
                      </h3>
                      <span className="font-dm text-sm text-terracotta font-medium whitespace-nowrap mt-0.5">
                        ab {apt.pricing.perNight} €<span className="text-cream/40 text-xs font-normal"> /Nacht</span>
                      </span>
                    </div>
                    <p className="font-dm text-sm text-cream/55 leading-relaxed line-clamp-2">
                      {apt.description}
                    </p>
                    <p className="font-dm text-xs text-cream/30 mt-3 group-hover:text-terracotta/60 transition-colors">
                      Verfügbarkeit & Buchung →
                    </p>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Button href="/ferienwohnungen" variant="outline">
            Alle Ferienwohnungen →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
