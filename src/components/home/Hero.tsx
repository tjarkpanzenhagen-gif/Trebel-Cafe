import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-espresso">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1600&q=80"
          alt="Gemütliches Café-Interieur mit warmem Licht"
          fill
          priority
          className="object-cover animate-ken-burns"
          sizes="100vw"
        />
      </div>

      {/* Asymmetric gradient — heavy left, fading right */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/75 to-espresso/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />

      {/* Ghost display text — massive background word */}
      <div
        className="absolute bottom-0 left-0 font-playfair leading-none select-none pointer-events-none text-white/[0.035]"
        style={{ fontSize: "clamp(10rem, 28vw, 28rem)" }}
        aria-hidden="true"
      >
        Café
      </div>

      {/* Rotating badge — top right */}
      <div className="absolute top-28 right-8 md:right-14 w-24 h-24 animate-spin-slow" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
          <defs>
            <path id="badgePath" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
          </defs>
          <text fontSize="8.5" letterSpacing="3.2" className="fill-cream/50 font-dm">
            <textPath href="#badgePath">HANDGEMACHT · HERZLICH · TRIBSEES · </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-terracotta" />
        </div>
      </div>

      {/* Main editorial content — bottom-left anchored */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-8 md:px-16 max-w-screen-xl mx-auto">

        {/* Location tag */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-px bg-terracotta" />
          <span className="font-dm text-terracotta text-xs tracking-[0.3em] uppercase">
            Tribsees · Mecklenburg-Vorpommern
          </span>
        </div>

        {/* Headline — editorial scale, stacked */}
        <h1 className="font-playfair text-cream leading-[0.88] mb-8">
          <span
            className="block font-semibold"
            style={{ fontSize: "clamp(3.2rem, 9.5vw, 9rem)" }}
          >
            Selbst-
          </span>
          <span
            className="block font-semibold"
            style={{ fontSize: "clamp(3.2rem, 9.5vw, 9rem)" }}
          >
            gebackenes
          </span>
          <span
            className="block font-light italic text-sand"
            style={{ fontSize: "clamp(2rem, 5.5vw, 5rem)", paddingLeft: "2vw" }}
          >
            mit Herz.
          </span>
        </h1>

        {/* Meta line */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mb-10">
          <span className="font-cormorant italic text-sand text-xl md:text-2xl">
            Do – Mo · 9 bis 17 Uhr
          </span>
          <span className="font-dm text-cream/40 text-xs tracking-widest uppercase">
            Familie Wendel-Bigalke
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <Button href="/speisekarte" variant="filled">
            Speisekarte
          </Button>
          <Button href="/reservierung" variant="outline-light">
            Reservierung
          </Button>
        </div>
      </div>

      {/* Vertical scroll indicator — right side */}
      <div
        className="absolute bottom-16 right-8 md:right-14 flex flex-col items-center gap-3 text-cream/30"
        aria-hidden="true"
      >
        <div className="h-14 w-px bg-gradient-to-b from-transparent to-cream/30" />
        <span className="writing-vertical font-dm text-[10px] tracking-[0.25em] uppercase">
          Scroll
        </span>
      </div>
    </section>
  );
}
