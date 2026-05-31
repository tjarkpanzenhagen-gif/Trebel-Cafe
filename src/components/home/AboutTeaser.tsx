import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function AboutTeaser() {
  return (
    <section className="py-20 px-6 bg-sand/20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photos — stacked layout */}
        <AnimatedSection>
          <div className="relative h-80 md:h-[460px]">
            {/* Back photo */}
            <div className="absolute top-0 left-0 w-[80%] h-[80%] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/Cafe/wir.jpg"
                alt="Team des Trebel Cafés"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
            </div>
            {/* Front photo */}
            <div className="absolute bottom-0 right-0 w-[58%] h-[58%] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-cream/60">
              <Image
                src="/images/Cafe/cafe-innen.jpg"
                alt="Gemütliches Café-Ambiente im Trebel Café"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Text */}
        <AnimatedSection delay={0.2} className="flex flex-col justify-center">
          <SectionLabel>Unsere Geschichte</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl text-espresso mb-6 leading-snug">
            Ein Café mit Seele — geführt von Familie Wendel-Bigalke.
          </h2>
          <p className="font-dm text-espresso/70 leading-relaxed mb-4">
            Das Trebel Café liegt im Herzen von Tribsees und wird von Familie Wendel-Bigalke geführt.
            Kuchen, Torten und Eintöpfe bereiten wir täglich frisch vor Ort zu — Eis und Brot
            kommen von regionalen Anbietern aus der Umgebung.
          </p>
          <Button href="/ueber-uns" variant="filled">
            Mehr über uns →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
