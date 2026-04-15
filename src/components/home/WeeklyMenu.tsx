import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { weeklyMenu } from "@/lib/content";

export default function WeeklyMenu() {
  return (
    <section className="py-24 md:py-32 bg-espresso px-8 md:px-16">
      <div className="max-w-5xl mx-auto">

        {/* Editorial header */}
        <AnimatedSection className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end gap-6 md:gap-20">
          <div className="flex-shrink-0">
            <p className="font-cormorant italic text-terracotta text-lg tracking-[0.2em] mb-4">
              Frisch & wechselnd
            </p>
            <h2
              className="font-playfair text-cream leading-[0.88]"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              Diese<br />Woche
            </h2>
          </div>
          <p className="font-dm text-cream/40 text-sm leading-relaxed max-w-xs md:mb-2">
            Die Karte wechselt mit dem Markt.
            Frisch, saisonal, aus eigener Hand.
          </p>
        </AnimatedSection>

        {/* Menu listing */}
        <div>
          {weeklyMenu.map((dish, i) => (
            <AnimatedSection key={dish.name} delay={i * 0.1}>
              <div className="group grid grid-cols-[1fr,auto] gap-8 items-start border-t border-cream/10 py-9 hover:border-terracotta/30 transition-colors duration-300">
                <div>
                  <h3
                    className="font-playfair text-cream mb-2 group-hover:text-sand transition-colors duration-300"
                    style={{ fontSize: "clamp(1.4rem, 3vw, 2.1rem)" }}
                  >
                    {dish.name}
                  </h3>
                  <p className="font-dm text-cream/40 text-sm leading-relaxed">
                    {dish.description}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 pt-1">
                  <span className="font-cormorant italic text-terracotta" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)" }}>
                    {dish.price}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
          <div className="border-t border-cream/10" />
        </div>

        {/* CTA */}
        <AnimatedSection className="mt-12">
          <Button href="/speisekarte" variant="outline-light">
            Zur vollen Speisekarte →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
