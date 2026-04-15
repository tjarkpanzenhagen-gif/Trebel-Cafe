import Link from "next/link";
import { contact, hours, closures2026 } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream/80 font-dm">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h3 className="font-playfair text-cream text-2xl mb-3">Trebelcafé</h3>
          <p className="text-sm leading-relaxed italic font-cormorant text-sand text-lg">
            Selbstgebackenes mit Herz — mitten in Tribsees.
          </p>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-playfair text-cream text-lg mb-4">Öffnungszeiten</h4>
          <p className="text-sm mb-1">{hours.open}</p>
          <p className="text-sm mb-4">{hours.closed}</p>
          <p className="text-xs text-cream/50 font-medium uppercase tracking-wider mb-2">Schließzeiten 2026</p>
          {closures2026.map((c) => (
            <p key={c} className="text-xs text-cream/60">{c}</p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-playfair text-cream text-lg mb-4">Kontakt</h4>
          <p className="text-sm mb-1">{contact.address}</p>
          <a href={`tel:${contact.phone}`} className="block text-sm hover:text-cream transition-colors mb-1">
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="block text-sm hover:text-cream transition-colors mb-4">
            {contact.email}
          </a>
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-terracotta hover:text-[#d4845c] transition-colors"
          >
            Auf Google Maps öffnen →
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10 py-6 px-6 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/40">
        <p>© {new Date().getFullYear()} Trebelcafé Tribsees — Familie Wendel-Bigalke</p>
        <div className="flex gap-6">
          <Link href="/impressum" className="hover:text-cream transition-colors">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-cream transition-colors">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
