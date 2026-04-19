import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Galerie — Trebelcafé Tribsees",
  description: "Bilder aus dem Trebelcafé — Atmosphäre, Kuchen und gemütliche Momente.",
};

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80", alt: "Gemütliche Café-Atmosphäre", tall: true },
  { src: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80", alt: "Frisch gebackene Croissants", tall: false },
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80", alt: "Cappuccino mit Latte Art", tall: false },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", alt: "Café-Innenraum mit warmem Licht", tall: true },
  { src: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&q=80", alt: "Selbstgebackene Brötchen", tall: false },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Kaffeespezialitäten", tall: false },
  { src: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=800&q=80", alt: "Frühstückstisch", tall: true },
  { src: "https://images.unsplash.com/photo-1442975631134-d6106c90a05e?w=800&q=80", alt: "Tischgedeck im Café", tall: false },
  { src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80", alt: "Kaffeebohnen und Tasse", tall: false },
];

export default function GaleriePage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-12">
          <SectionLabel>Einblicke</SectionLabel>
          <h1 className="font-playfair text-5xl text-espresso mb-4">Galerie</h1>
          <p className="font-dm text-espresso/60 max-w-sm mx-auto">
            Atmosphäre, Kuchen und gemütliche Momente aus dem Trebelcafé.
          </p>
        </AnimatedSection>

        {/* Masonry-style grid using CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-8">
          {galleryImages.map((img, i) => (
            <AnimatedSection key={img.src} delay={i * 0.06} className="break-inside-avoid mb-4">
              <div
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  img.tall ? "h-80" : "h-56"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-300 flex items-end p-4">
                  <p className="font-cormorant italic text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 transition-transform">
                    {img.alt}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
