import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutz — Trebelcafé Tribsees" };

export default function DatenschutzPage() {
  return (
    <div className="pt-24 px-6 bg-cream min-h-screen">
      <div className="max-w-2xl mx-auto py-16">
        <h1 className="font-playfair text-4xl text-espresso mb-8">Datenschutzerklärung</h1>
        <div className="font-dm text-espresso/70 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-playfair text-xl text-espresso mb-3">1. Datenschutz auf einen Blick</h2>
            <p>Diese Website erhebt keine personenbezogenen Daten ohne Ihre Einwilligung. Es werden keine Tracking-Tools, Cookies oder externe Analysedienste eingesetzt.</p>
          </section>
          <section>
            <h2 className="font-playfair text-xl text-espresso mb-3">2. Kontaktformular</h2>
            <p>Wenn Sie das Reservierungsformular nutzen, werden Ihre Angaben zur Bearbeitung der Anfrage verwendet und nicht an Dritte weitergegeben.</p>
          </section>
          <section>
            <h2 className="font-playfair text-xl text-espresso mb-3">3. Google Maps</h2>
            <p>Diese Website enthält Links zu Google Maps. Beim Aufruf des Links gelten die Datenschutzbestimmungen von Google (google.com/privacy).</p>
          </section>
          <section>
            <h2 className="font-playfair text-xl text-espresso mb-3">4. Ihre Rechte</h2>
            <p>Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer Daten. Kontakt: trebelcafe@gmx.de</p>
          </section>
        </div>
      </div>
    </div>
  );
}
