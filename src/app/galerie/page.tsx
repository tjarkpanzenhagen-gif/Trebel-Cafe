import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Galerie — Trebelcafé Tribsees",
  description: "Bilder aus dem Trebelcafé — Atmosphäre, Kuchen und gemütliche Momente.",
};

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80", alt: "Gemütliche Café-Atmosphäre", tall: true },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", alt: "Frisch gebackener Kuchen", tall: false },
  { src: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80", alt: "Cappuccino mit Herz", tall: false },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", alt: "Café-Innenraum mit warmem Licht", tall: true },
  { src: "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&q=80", alt: "Selbstgebackene Brötchen", tall: false },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", alt: "Kaffeespezialitäten", tall: false },
  { src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&q=80", alt: "Kuchenvitrine", tall: true },
  { src: "https://images.unsplash.com/photo-1442975631134-d6106c90a05e?w=800&q=80", alt: "Tischgedeck im Café", tall: false },
  { src: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80", alt: "Frühstücksset", tall: false },
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
