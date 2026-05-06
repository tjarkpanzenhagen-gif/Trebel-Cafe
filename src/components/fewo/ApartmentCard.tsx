import Link from "next/link";
import type { Apartment } from "@/lib/fewo-store";
import PricingTable from "@/components/fewo/PricingTable";
import AnimatedSection from "@/components/ui/AnimatedSection";

type Props = {
  apartment: Apartment;
  delay?: number;
};

const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  "wohnung-1": [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=450&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=450&auto=format&fit=crop&q=80",
  ],
  "wohnung-2": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=450&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=450&auto=format&fit=crop&q=80",
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
            <img
              src={images[0]}
              alt={apartment.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((src, i) => (
              <div key={i} className="relative overflow-hidden">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
