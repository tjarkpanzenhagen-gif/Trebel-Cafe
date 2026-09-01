import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { readFewo } from "@/lib/fewo-store";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  "wohnung-1": "/images/wohnungen/klein-wohnen.jpg",
  "wohnung-2": "/images/wohnungen/gross-wohnen1.jpg",
};

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
          <p className="font-dm text-cream/55 max-w-sm mx-auto text-sm leading-relaxed">
            Zwei gemütliche Ferienwohnungen — direkt am Café, mit Bettwäsche und Handtüchern inklusive.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {apartments.map((apt, i) => {
            const imgSrc =
              apt.images[0] ?? PLACEHOLDER_IMAGES[apt.id] ?? PLACEHOLDER_IMAGES["wohnung-1"];

            return (
              <AnimatedSection key={apt.id} delay={i * 0.15}>
                <Link href={`/ferienwohnungen/${apt.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-cream/10 hover:border-terracotta/40 transition-colors duration-300">
                    {/* Image with overlay */}
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={apt.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 photo-warm"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 font-dm text-xs text-sage bg-espresso/80 backdrop-blur-sm border border-sage/30 px-2.5 py-1 rounded-full">
                        ✓ Bettwäsche & Handtücher inklusive
                      </span>
                    </div>
                    {/* Info */}
                    <div className="p-5 bg-espresso/60">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-playfair text-xl text-cream group-hover:text-terracotta transition-colors">
                          {apt.name}
                        </h3>
                        <span className="font-dm text-sm text-terracotta font-medium whitespace-nowrap mt-0.5">
                          ab {apt.pricing.perNight} €<span className="text-cream/35 text-xs font-normal"> /Nacht</span>
                        </span>
                      </div>
                      <p className="font-dm text-sm text-cream/50 leading-relaxed line-clamp-2">
                        {apt.description}
                      </p>
                      <p className="font-dm text-xs text-cream/30 mt-3 group-hover:text-terracotta/60 transition-colors">
                        Verfügbarkeit & Buchung →
                      </p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
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
