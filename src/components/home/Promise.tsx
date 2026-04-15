import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { promises } from "@/lib/content";

export default function Promise() {
  return (
    <section className="bg-sand/40 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <SectionLabel>Was uns ausmacht</SectionLabel>
          <h2 className="font-playfair text-3xl md:text-4xl text-espresso">
            Unser Versprechen
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((p, i) => (
            <AnimatedSection key={p.title} delay={i * 0.15}>
              <div className="bg-cream rounded-2xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-center">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="font-playfair text-xl text-espresso mb-3">{p.title}</h3>
                <p className="font-dm text-sm text-espresso/70 leading-relaxed">{p.text}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
