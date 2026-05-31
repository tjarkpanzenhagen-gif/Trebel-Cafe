import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function AboutTeaser() {
  return (
    <section className="py-20 px-6 bg-sand/20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <AnimatedSection>
          <div className="relative h-80 md:h-[460px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/Cafe/wir.jpg"
              alt="Team des Trebel Cafés"
              fill
              className="object-cover object-top hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
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
