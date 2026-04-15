import type { Metadata } from "next";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionLabel from "@/components/ui/SectionLabel";
import { HugeiconsIcon } from "@hugeicons/react";
import { TelephoneIcon, Mail01Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { contact, buffetDates } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reservierung — Trebelcafé Tribsees",
  description: "Tisch reservieren im Trebelcafé Tribsees. Auch für unsere Frühstücksbuffets.",
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
          {/* Form */}
          <AnimatedSection>
            <form action="mailto:trebelcafe@gmx.de" method="POST" encType="text/plain" className="space-y-5">
              <div>
                <label className="block font-dm text-sm text-espresso/70 mb-2">Euer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors"
                  placeholder="Vorname Nachname"
                />
              </div>
              <div>
                <label className="block font-dm text-sm text-espresso/70 mb-2">Telefon oder E-Mail *</label>
                <input
                  type="text"
                  required
                  className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors"
                  placeholder="Wie können wir euch erreichen?"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block font-dm text-sm text-espresso/70 mb-2">Datum *</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-base bg-cream focus:outline-none focus:border-terracotta transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-dm text-sm text-espresso/70 mb-2">Uhrzeit *</label>
                  <select className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-base bg-cream focus:outline-none focus:border-terracotta transition-colors">
                    {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"].map((t) => (
                      <option key={t}>{t} Uhr</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-dm text-sm text-espresso/70 mb-2">Personenzahl *</label>
                <select className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n}>{n} {n === 1 ? "Person" : "Personen"}</option>
                  ))}
                  <option>Mehr als 8 (bitte Nachricht hinterlassen)</option>
                </select>
              </div>
              <div>
                <label className="block font-dm text-sm text-espresso/70 mb-2">Nachricht (optional)</label>
                <textarea
                  rows={4}
                  className="w-full border border-sand rounded-xl px-4 py-3 font-dm text-sm bg-cream focus:outline-none focus:border-terracotta transition-colors resize-none"
                  placeholder="Besondere Anlässe, Allergien, Wünsche..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-terracotta text-white py-4 rounded-xl font-dm font-medium hover:bg-[#b3623c] transition-colors duration-300"
              >
                Anfrage senden
              </button>
              <p className="text-xs text-espresso/40 text-center font-dm">
                Wir melden uns schnellstmöglich zur Bestätigung.
              </p>
            </form>
          </AnimatedSection>

          {/* Sidebar */}
          <AnimatedSection delay={0.2} className="space-y-10">
            {/* Direct contact */}
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

            {/* Buffet dates */}
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
