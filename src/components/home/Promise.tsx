import AnimatedSection from "@/components/ui/AnimatedSection";
import { promises } from "@/lib/content";

export default function Promise() {
  return (
    <section className="py-24 md:py-32 px-8 md:px-16 bg-cream">
      <div className="max-w-5xl mx-auto">

        {/* Opening quote */}
        <AnimatedSection className="mb-20 md:mb-28">
          <p
            className="font-cormorant italic text-espresso/60 leading-snug max-w-2xl"
            style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.25rem)" }}
          >
            „Jeder Kuchen entsteht in unserer eigenen Küche —
            mit Liebe und ohne Kompromisse."
          </p>
        </AnimatedSection>

        {/* Numbered editorial rows */}
        <div>
          {promises.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.12}>
              <div className="group flex gap-8 md:gap-14 py-10 border-t border-espresso/10 hover:border-terracotta/30 transition-colors duration-500 cursor-default">

                {/* Large decorative number */}
                <div className="flex-shrink-0 w-14 md:w-20">
                  <span
                    className="font-cormorant leading-none text-espresso/10 group-hover:text-terracotta/25 transition-colors duration-500 select-none"
                    style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3
                    className="font-playfair text-espresso mb-3 group-hover:text-terracotta transition-colors duration-300"
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.6rem)" }}
                  >
                    {p.title}
                  </h3>
                  <p className="font-dm text-espresso/55 leading-relaxed max-w-lg text-sm md:text-base">
                    {p.text}
                  </p>
                </div>

                {/* Hover arrow */}
                <div className="hidden md:flex items-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                  <span className="text-terracotta text-xl">→</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
          {/* Closing rule */}
          <div className="border-t border-espresso/10" />
        </div>
      </div>
    </section>
  );
}
