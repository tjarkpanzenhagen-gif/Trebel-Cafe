import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";

export default function AboutTeaser() {
  return (
    <section className="bg-cream overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* Image — full height, bleeds to edge */}
        <AnimatedSection className="relative h-72 lg:h-auto order-last lg:order-first">
          <Image
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80"
            alt="Gemütliches Café-Ambiente im Trebelcafé"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle right-edge fade on desktop */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-cream" />
        </AnimatedSection>

        {/* Text — generous padding, editorial */}
        <AnimatedSection delay={0.15} className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 lg:py-24">
          <p className="font-dm text-terracotta text-xs tracking-[0.3em] uppercase mb-8">
            Unsere Geschichte
          </p>

          <h2
            className="font-playfair text-espresso leading-[1.0] mb-8"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
          >
            Ein Café mit Seele —<br />
            <span className="font-light italic">geführt von Familie<br />Wendel-Bigalke.</span>
          </h2>

          <p className="font-dm text-espresso/60 leading-relaxed mb-8 text-sm md:text-base max-w-sm">
            Im Herzen von Tribsees empfangen wir euch mit frisch gebackenem Kuchen,
            hausgemachten Gerichten und der Wärme, die nur ein echter Familienbetrieb kennt.
          </p>

          {/* Large blockquote */}
          <div className="border-l border-terracotta pl-6 mb-10">
            <p className="font-cormorant italic text-espresso/70" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)" }}>
              „Wir backen alles selbst — das ist kein<br />
              Versprechen, das ist unser Alltag."
            </p>
          </div>

          {/* Text link — more editorial than a filled button */}
          <Link
            href="/ueber-uns"
            className="group inline-flex items-center gap-3 font-dm text-sm text-espresso tracking-wide"
          >
            <span className="border-b border-espresso/30 group-hover:border-terracotta group-hover:text-terracotta transition-colors duration-300 pb-0.5">
              Mehr über uns
            </span>
            <span className="text-terracotta group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
