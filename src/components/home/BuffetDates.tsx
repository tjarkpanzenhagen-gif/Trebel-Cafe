import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { buffetDates } from "@/lib/content";

export default function BuffetDates() {
  return (
    <section className="py-24 md:py-32 px-8 md:px-16 bg-sand/25">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <div>
            <p className="font-cormorant italic text-terracotta text-lg tracking-[0.2em] mb-4">
              Besondere Momente
            </p>
            <h2
              className="font-playfair text-espresso leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Nächste<br />Frühstücksbuffets
            </h2>
          </div>
          <p className="font-dm text-espresso/50 text-sm leading-relaxed max-w-xs md:mb-2">
            Plätze sind begrenzt —<br />Reservierung erforderlich.
          </p>
        </AnimatedSection>

        {/* Typographic date listing */}
        <div>
          {buffetDates.map((event, i) => (
            <AnimatedSection key={event.date} delay={i * 0.1}>
              <div className="group border-t border-espresso/10 hover:border-terracotta/30 transition-colors duration-400 py-10 grid grid-cols-[1fr,auto] items-center gap-8">
                <div>
                  <h3
                    className="font-playfair text-espresso group-hover:text-terracotta transition-colors duration-300 mb-1"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
                  >
                    {event.date}
                  </h3>
                  <p className="font-cormorant italic text-espresso/50 text-lg">
                    {event.detail}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="font-dm text-xs text-espresso/35 uppercase tracking-widest">
                    {event.note}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
          <div className="border-t border-espresso/10" />
        </div>

        {/* CTA */}
        <AnimatedSection className="mt-12">
          <Button href="/reservierung" variant="filled">
            Jetzt reservieren →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
