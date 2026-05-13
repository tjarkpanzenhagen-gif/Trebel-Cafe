import Link from "next/link";
import Image from "next/image";
import type { Apartment } from "@/lib/fewo-store";
import PricingTable from "@/components/fewo/PricingTable";
import AnimatedSection from "@/components/ui/AnimatedSection";

type Props = {
  apartment: Apartment;
  delay?: number;
};

const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  "wohnung-1": [
    "/images/wohnungen/wohnung-01.jpg",
    "/images/wohnungen/wohnung-02.jpg",
    "/images/wohnungen/wohnung-03.jpg",
  ],
  "wohnung-2": [
    "/images/wohnungen/wohnung-04.jpg",
    "/images/wohnungen/wohnung-05.jpg",
    "/images/wohnungen/wohnung-01.jpg",
  ],
};

const AMENITIES = [
  { label: "Frühstück inklusive", highlight: true },
  { label: "WLAN", highlight: false },
  { label: "Ruhige Lage", highlight: false },
];

export default function ApartmentCard({ apartment, delay = 0 }: Props) {
  const images =
    apartment.images.length > 0
      ? apartment.images
      : (PLACEHOLDER_IMAGES[apartment.id] ?? PLACEHOLDER_IMAGES["wohnung-1"]);

  return (
    <AnimatedSection delay={delay} className="border-b border-sand last:border-b-0">
      <div className="py-16 px-6 max-w-4xl mx-auto">
        {/* Image grid */}
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden mb-10 h-72">
          <div className="col-span-2 relative overflow-hidden">
            <Image
              src={images[0]}
              alt={apartment.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((src, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Info */}
          <div>
            <span className="font-dm text-xs text-espresso/40 uppercase tracking-widest">
              Ferienwohnung · Tribsees
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-espresso mt-1 mb-4">
              {apartment.name}
            </h2>
            <p className="font-dm text-sm text-espresso/70 leading-relaxed mb-6">
              {apartment.description}
            </p>

            {/* Amenity badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="font-dm text-xs text-sage bg-sage/10 border border-sage/20 px-3 py-1.5 rounded-full">
                ✓ Frühstück inklusive
              </span>
              <span className="font-dm text-xs text-espresso/55 bg-sand/50 px-3 py-1.5 rounded-full">
                WLAN
              </span>
              <span className="font-dm text-xs text-espresso/55 bg-sand/50 px-3 py-1.5 rounded-full">
                Ruhige Lage
              </span>
              <span className="font-dm text-xs text-espresso/55 bg-sand/50 px-3 py-1.5 rounded-full">
                bis zu {apartment.maxPersons} Personen
              </span>
            </div>
          </div>

          {/* Pricing + CTA */}
          <div className="space-y-4">
            <PricingTable pricing={apartment.pricing} discounts={apartment.discounts} />
            <Link
              href={`/ferienwohnungen/${apartment.slug}`}
              className="block w-full text-center px-6 py-3 rounded-full bg-espresso text-cream font-dm text-sm font-medium hover:bg-terracotta transition-all duration-300"
            >
              Verfügbarkeit & Buchung →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
