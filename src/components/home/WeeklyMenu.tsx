import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { weeklyMenu } from "@/lib/content";

export default function WeeklyMenu() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel>Frisch & wechselnd</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl text-espresso">
            Was kocht diese Woche?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {weeklyMenu.map((dish, i) => (
            <AnimatedSection key={dish.name} delay={i * 0.12}>
              <div className="border border-sand rounded-2xl p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 bg-cream group">
                <div className="w-8 h-px bg-terracotta mb-4 group-hover:w-16 transition-all duration-300" />
                <h3 className="font-playfair text-xl text-espresso mb-2">{dish.name}</h3>
                <p className="font-dm text-sm text-espresso/60 mb-4 leading-relaxed">{dish.description}</p>
                <p className="font-playfair text-terracotta text-lg font-semibold">{dish.price}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Button href="/speisekarte" variant="outline">
            Zur vollen Speisekarte →
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
