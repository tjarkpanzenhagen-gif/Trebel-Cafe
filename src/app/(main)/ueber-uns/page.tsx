import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { HugeiconsIcon } from "@hugeicons/react";
import { CroissantIcon, HouseHeartIcon, Coffee01Icon } from "@hugeicons/core-free-icons";
import { promises } from "@/lib/content";

const promiseIcons = [CroissantIcon, HouseHeartIcon, Coffee01Icon];

export const metadata: Metadata = {
  title: "Über uns — Trebel Café Tribsees",
  description: "Das Trebel Café in Tribsees — geführt von Familie Wendel-Bigalke. Kuchen, Torten und Eintöpfe frisch aus eigener Küche, Eis und Brot aus der Region.",
};

export default function UeberUnsPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero image */}
      <div className="relative h-72 md:h-[28rem] overflow-hidden">
        <Image
          src="/images/Cafe/cafe-04.jpg"
          alt="Trebel Café Atmosphäre"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-espresso/50 flex items-center justify-center text-center">
          <div>
            <SectionLabel light>Wer wir sind</SectionLabel>
            <h1 className="font-playfair text-4xl md:text-5xl text-white">Über uns</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <AnimatedSection>
            <SectionLabel>Unsere Geschichte</SectionLabel>
            <h2 className="font-playfair text-3xl text-espresso mb-6">Familie Wendel-Bigalke</h2>
            <p className="font-dm text-espresso/70 leading-relaxed mb-4">
              Das Trebel Café liegt im Herzen von Tribsees und wird von Familie Wendel-Bigalke geführt.
              Donnerstag bis Montag öffnen wir unsere Türen — für alle, die einen gemütlichen Moment suchen.
            </p>
            <p className="font-dm text-espresso/70 leading-relaxed mb-4">
              Unsere Kuchen, Torten und Eintöpfe werden täglich frisch vor Ort zubereitet.
              Eis und Brot beziehen wir von regionalen Anbietern.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/Cafe/wir1.jpg"
                alt="Familie Wendel-Bigalke im Trebel Café"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Promises */}
        <AnimatedSection className="text-center mb-12">
          <div className="w-16 h-px bg-terracotta mx-auto mb-8" />
          <h2 className="font-playfair text-3xl text-espresso">Warum das Trebel Café?</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="text-center p-8 bg-sand/30 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <HugeiconsIcon icon={promiseIcons[i]} size={30} color="#C4724A" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair text-xl text-espresso mb-3">{p.title}</h3>
                <p className="font-dm text-sm text-espresso/60 leading-relaxed">{p.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
