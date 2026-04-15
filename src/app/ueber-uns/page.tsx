import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { promises } from "@/lib/content";

export const metadata: Metadata = {
  title: "Über uns — Trebelcafé Tribsees",
  description: "Familie Wendel-Bigalke und die Geschichte des Trebelcafés. Wir backen alles selbst — seit dem ersten Tag.",
};

export default function UeberUnsPage() {
  return (
    <div className="pt-16 bg-cream min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1442975631134-d6106c90a05e?w=1400&q=80"
          alt="Gemütliche Café-Atmosphäre"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-espresso/50 flex items-end pb-12 px-6">
          <div className="max-w-6xl mx-auto w-full">
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
              Im Herzen von Tribsees, unweit der ruhigen Trebel, öffneten wir einst die Türen
              unseres kleinen Cafés. Was als Herzensprojekt begann, ist heute ein Ort, an dem
              Menschen zusammenkommen, verweilen und Gutes genießen.
            </p>
            <p className="font-dm text-espresso/70 leading-relaxed mb-6">
              Unser Grundsatz war von Anfang an simpel: Wir backen alles selbst. Kein Tiefkühlkuchen,
              keine Fertigmischungen — nur ehrliche Zutaten, Erfahrung und Liebe zum Handwerk.
            </p>
            <blockquote className="border-l-2 border-terracotta pl-6 py-2">
              <p className="font-cormorant italic text-2xl text-espresso leading-relaxed">
                &quot;Ein Café ist für uns kein Geschäft — es ist eine Einladung.&quot;
              </p>
              <footer className="font-dm text-sm text-espresso/50 mt-2">
                — Familie Wendel-Bigalke
              </footer>
            </blockquote>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80"
                alt="Frisch gebackener Kuchen aus unserer Backstube"
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
          <h2 className="font-playfair text-3xl text-espresso">Warum das Trebelcafé?</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="text-center p-8 bg-sand/30 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="text-4xl mb-4">{p.icon}</div>
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
