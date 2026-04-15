import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background image with Ken-Burns */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600&q=80"
          alt="Gemütliches Café-Interieur mit warmem Licht"
          fill
          priority
          className="object-cover animate-ken-burns"
          sizes="100vw"
        />
      </div>

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-espresso/50 via-espresso/40 to-espresso/60" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="font-cormorant italic text-sand text-xl tracking-[0.2em] mb-4 opacity-90">
          Herzlich willkommen
        </p>
        <h1 className="font-playfair text-white text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6">
          Selbstgebackenes mit Herz —<br />
          <span className="text-sand">mitten in Tribsees.</span>
        </h1>
        <p className="font-dm text-cream/80 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Familie Wendel-Bigalke begrüßt euch{" "}
          <span className="text-sand font-medium">Do – Mo von 9 bis 17 Uhr</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/speisekarte" variant="filled">
            Speisekarte entdecken
          </Button>
          <Button href="/reservierung" variant="outline-light">
            Tisch reservieren
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/50">
        <p className="text-xs tracking-widest uppercase font-dm">Scroll</p>
        <div className="w-px h-8 bg-cream/30 animate-pulse" />
      </div>
    </section>
  );
}
