import AnimatedSection from "@/components/ui/AnimatedSection";
import { contact, hours, closures2026 } from "@/lib/content";

export default function ContactSection() {
  return (
    <section className="bg-espresso text-cream py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Hours */}
        <AnimatedSection>
          <p className="font-cormorant italic text-sand text-lg tracking-widest mb-4">
            Wann ihr uns findet
          </p>
          <h2 className="font-playfair text-3xl text-cream mb-6">Öffnungszeiten</h2>
          <p className="font-dm text-cream/80 mb-2">{hours.open}</p>
          <p className="font-dm text-cream/60 mb-8">{hours.closed}</p>
          <p className="text-xs text-cream/40 uppercase tracking-widest mb-3">Schließzeiten 2026</p>
          {closures2026.map((c) => (
            <p key={c} className="font-dm text-sm text-cream/50 mb-1">{c}</p>
          ))}
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection delay={0.2}>
          <p className="font-cormorant italic text-sand text-lg tracking-widest mb-4">
            So erreicht ihr uns
          </p>
          <h2 className="font-playfair text-3xl text-cream mb-6">Kontakt & Anfahrt</h2>
          <p className="font-dm text-cream/70 mb-4">{contact.address}</p>
          <a
            href={`tel:${contact.phone}`}
            className="block font-dm text-lg text-cream hover:text-sand transition-colors mb-2"
          >
            📞 {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="block font-dm text-cream/70 hover:text-cream transition-colors mb-8"
          >
            ✉️ {contact.email}
          </a>
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-terracotta text-terracotta px-6 py-3 rounded-full text-sm hover:bg-terracotta hover:text-white transition-all duration-300"
          >
            Auf Google Maps öffnen →
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
