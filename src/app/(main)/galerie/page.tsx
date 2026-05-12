import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Galerie — Trebelcafé Tribsees",
  description: "Bilder aus dem Trebelcafé — Atmosphäre, Kuchen und gemütliche Momente.",
};

const galleryImages = [
  { src: "/images/Cafe/cafe-01.jpg", alt: "Trebelcafé Atmosphäre", tall: true },
  { src: "/images/Cafe/cafe-02.jpg", alt: "Trebelcafé Einblick", tall: false },
  { src: "/images/Cafe/cafe-03.jpg", alt: "Gemütliche Momente", tall: false },
  { src: "/images/Cafe/cafe-04.jpg", alt: "Trebelcafé Innenraum", tall: true },
  { src: "/images/Cafe/cafe-05.jpg", alt: "Selbstgebackenes", tall: false },
  { src: "/images/Cafe/cafe-06.jpg", alt: "Kaffee und Kuchen", tall: false },
  { src: "/images/Cafe/cafe-07.jpg", alt: "Trebelcafé Tribsees", tall: true },
  { src: "/images/Cafe/cafe-08.jpg", alt: "Herzlich willkommen", tall: false },
  { src: "/images/Cafe/cafe-09.jpg", alt: "Familie Wendel-Bigalke", tall: false },
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
