import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-cormorant italic text-terracotta text-lg tracking-widest mb-4">
          Seite nicht gefunden
        </p>
        <h1 className="font-playfair text-8xl md:text-9xl text-espresso/10 leading-none select-none mb-2">
          404
        </h1>
        <h2 className="font-playfair text-2xl text-espresso mb-4">
          Diese Seite gibt es nicht
        </h2>
        <p className="font-dm text-sm text-espresso/60 leading-relaxed mb-8">
          Vielleicht wurde die Seite verschoben oder der Link ist veraltet.
          Kehren Sie zur Startseite zurück.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-espresso text-cream font-dm text-sm hover:bg-terracotta transition-colors duration-300"
          >
            Zur Startseite
          </Link>
          <Link
            href="/speisekarte"
            className="px-6 py-3 rounded-full border border-sand text-espresso font-dm text-sm hover:border-terracotta hover:text-terracotta transition-colors duration-300"
          >
            Speisekarte
          </Link>
        </div>
      </div>
    </main>
  );
}
