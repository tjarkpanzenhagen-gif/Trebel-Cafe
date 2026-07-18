import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import GalerieGrid from "@/components/galerie/GalerieGrid";

export const metadata: Metadata = {
  title: "Galerie — Trebel Café Tribsees",
  description: "Bilder aus dem Trebel Café — Atmosphäre, Kuchen und gemütliche Momente.",
  alternates: { canonical: "/galerie" },
};

const galleryImages = [
  { src: "/images/Cafe/cafe-01.jpg", alt: "Trebel Café Atmosphäre" },
  { src: "/images/Cafe/cafe-02.jpg", alt: "Trebel Café Einblick" },
  { src: "/images/Cafe/cafe-05.jpg", alt: "Trebel Café Tribsees" },
];

export default function GaleriePage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center py-12">
          <SectionLabel>Einblicke</SectionLabel>
          <h1 className="font-playfair text-5xl text-espresso mb-4">Galerie</h1>
          <p className="font-dm text-espresso/60 max-w-sm mx-auto">
            Atmosphäre, Kuchen und gemütliche Momente aus dem Trebel Café.
          </p>
        </AnimatedSection>

        <GalerieGrid images={galleryImages} />
      </div>
    </div>
  );
}
