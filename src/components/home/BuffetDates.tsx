import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { buffetDates } from "@/lib/content";

export default function BuffetDates() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel>Besondere Momente</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl text-espresso mb-4">
            Nächste Frühstücksbuffets
          </h2>
          <p className="font-dm text-espresso/60 max-w-md mx-auto">
            Unser Frühstücksbuffet ist ein besonderes Erlebnis — und Plätze sind begrenzt.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {buffetDates.map((event, i) => (
            <AnimatedSection key={event.date} delay={i * 0.15}>
              <div className="relative bg-sand/40 rounded-2xl p-8 border border-sand text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍳</span>
                </div>
                <h3 className="font-playfair text-2xl text-espresso mb-1">{event.date}</h3>
                <p className="font-cormorant italic text-terracotta mb-3">{event.detail}</p>
                <p className="font-dm text-xs text-espresso/50 uppercase tracking-wider">{event.note}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Button href="/reservierung" variant="filled">
            Jetzt reservieren →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
