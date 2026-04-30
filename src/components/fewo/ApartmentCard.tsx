import Link from "next/link";
import type { Apartment } from "@/lib/fewo-store";
import PricingTable from "@/components/fewo/PricingTable";
import AnimatedSection from "@/components/ui/AnimatedSection";

type Props = {
  apartment: Apartment;
  delay?: number;
};

const PLACEHOLDER_COLORS = [
  "bg-[#C8B89A]",
  "bg-[#D4C4AC]",
  "bg-[#BFB090]",
  "bg-[#C0AD95]",
];

export default function ApartmentCard({ apartment, delay = 0 }: Props) {
  const hasImages = apartment.images.length > 0;

  return (
    <AnimatedSection delay={delay} className="border-b border-sand last:border-b-0">
      <div className="py-16 px-6 max-w-4xl mx-auto">
        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-10 h-64">
          {hasImages ? (
            <>
              <div className="col-span-2 relative">
                <img
                  src={apartment.images[0]}
                  alt={apartment.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-2">
                {apartment.images.slice(1, 3).map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div
                className={`col-span-2 ${PLACEHOLDER_COLORS[0]} flex items-center justify-center`}
              >
                <span className="font-dm text-xs text-espresso/40">Fotos folgen</span>
              </div>
              <div className="grid grid-rows-2 gap-2">
                <div className={PLACEHOLDER_COLORS[1]} />
                <div className={PLACEHOLDER_COLORS[2]} />
              </div>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div>
            <span className="font-dm text-xs text-espresso/40 uppercase tracking-widest">
              Ferienwohnung
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-espresso mt-1 mb-4">
              {apartment.name}
            </h2>
            <p className="font-dm text-sm text-espresso/70 leading-relaxed mb-4">
              {apartment.description}
            </p>
            <p className="font-dm text-xs text-espresso/50">
              Bis zu {apartment.maxPersons} Personen
            </p>
          </div>

          {/* Pricing + CTA */}
          <div className="space-y-4">
            <PricingTable pricing={apartment.pricing} discounts={apartment.discounts} />
            <Link
              href={`/ferienwohnungen/${apartment.slug}`}
              className="block w-full text-center px-6 py-3 rounded-full bg-espresso text-cream font-dm text-sm font-medium hover:bg-terracotta transition-all duration-300"
            >
              Zum Angebot →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
