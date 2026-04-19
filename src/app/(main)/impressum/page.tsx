import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum — Trebelcafé Tribsees" };

export default function ImpressumPage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="font-playfair text-4xl text-espresso mb-8">Impressum</h1>
        <div className="font-dm text-espresso/70 space-y-4 text-sm leading-relaxed">
          <p><strong className="text-espresso">Angaben gemäß § 5 TMG</strong></p>
          <p>Familie Wendel-Bigalke<br />Trebelcafé Tribsees<br />Tribsees, Mecklenburg-Vorpommern</p>
          <p><strong className="text-espresso">Kontakt</strong><br />
            Telefon: 038320 649921<br />
            E-Mail: trebelcafe@gmx.de
          </p>
          <p className="text-espresso/50 text-xs pt-4">
            Haftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
          </p>
        </div>
      </div>
    </div>
  );
}
