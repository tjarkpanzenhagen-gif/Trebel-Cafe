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
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
              alt="Gemütliches Café-Ambiente im Trebelcafé"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
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
            Im Herzen von Tribsees liegt unser kleines, gemütliches Café. Wir empfangen euch
            mit frisch gebackenem Kuchen, hausgemachten Gerichten und der Wärme, die man nur
            in einem echten Familienbetrieb findet.
          </p>
          <blockquote className="border-l-2 border-terracotta pl-4 mb-6">
            <p className="font-cormorant italic text-xl text-espresso/80">
              &quot;Wir backen alles selbst — das ist kein Versprechen, das ist unser Alltag.&quot;
            </p>
          </blockquote>
          <Button href="/ueber-uns" variant="filled">
            Mehr über uns →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
