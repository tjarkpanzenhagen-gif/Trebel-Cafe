import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { HugeiconsIcon } from "@hugeicons/react";
import { TelephoneIcon, Mail01Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { contact, buffetDates } from "@/lib/content";
import ReservierungForm from "./ReservierungForm";

export const metadata: Metadata = {
  title: "Reservierung — Trebel Café Tribsees",
  description: "Tisch reservieren im Trebel Café Tribsees. Auch für unsere Frühstücksbuffets.",
  alternates: { canonical: "/reservierung" },
};

export default function ReservierungPage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto py-16">
        <AnimatedSection className="text-center mb-16">
          <SectionLabel>Wir freuen uns auf euch</SectionLabel>
          <h1 className="font-playfair text-5xl text-espresso mb-4">Reservierung</h1>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatedSection>
            <ReservierungForm />
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="space-y-10">
            <div className="bg-sand/30 rounded-2xl p-8">
              <h3 className="font-playfair text-xl text-espresso mb-5">Lieber direkt?</h3>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 font-dm text-espresso hover:text-terracotta transition-colors mb-3"
              >
                <HugeiconsIcon icon={TelephoneIcon} size={16} color="currentColor" strokeWidth={1.5} />
                {contact.phone}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 font-dm text-espresso/70 hover:text-terracotta transition-colors"
              >
                <HugeiconsIcon icon={Mail01Icon} size={16} color="currentColor" strokeWidth={1.5} />
                {contact.email}
              </a>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <HugeiconsIcon icon={Calendar01Icon} size={18} color="#C4724A" strokeWidth={1.5} />
                <h3 className="font-playfair text-xl text-espresso">Frühstücksbuffets 2026</h3>
              </div>
              <div className="space-y-4">
                {buffetDates.map((event) => (
                  <div key={event.date} className="border-l-2 border-terracotta pl-4">
                    <p className="font-playfair text-lg text-espresso">{event.date}</p>
                    <p className="font-cormorant italic text-terracotta">{event.detail}</p>
                    <p className="font-dm text-xs text-espresso/50">{event.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
