import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import GalerieGrid from "@/components/galerie/GalerieGrid";

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

        <GalerieGrid images={galleryImages} />
      </div>
    </div>
  );
}
