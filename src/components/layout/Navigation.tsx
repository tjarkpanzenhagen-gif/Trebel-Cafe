"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/galerie", label: "Galerie" },
  { href: "/reservierung", label: "Reservierung" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent border-b border-transparent"
            : "bg-cream/96 backdrop-blur-md border-b border-espresso/8"
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between">

          {/* Logo — Playfair, slightly larger on desktop */}
          <Link
            href="/"
            className={`font-playfair text-lg md:text-xl font-semibold tracking-wide transition-colors duration-400 ${
              transparent ? "text-white" : "text-espresso"
            }`}
          >
            Trebelcafé
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs tracking-[0.12em] uppercase transition-colors duration-300 group ${
                  transparent ? "text-white/80 hover:text-white" : "text-espresso/70 hover:text-espresso"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Pill CTA */}
            <Link
              href="/reservierung"
              className={`ml-2 px-5 py-2 text-xs tracking-[0.12em] uppercase border transition-all duration-300 ${
                transparent
                  ? "border-white/50 text-white hover:bg-white hover:text-espresso"
                  : "border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
              }`}
            >
              Reservierung
            </Link>
          </nav>

          {/* Mobile hamburger — two clean lines */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
            className={`md:hidden flex flex-col justify-center gap-[6px] w-8 h-8 ${
              transparent ? "text-white" : "text-espresso"
            }`}
          >
            <span
              className={`block h-px bg-current transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[7px] w-6" : "w-6"
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0 w-0" : "w-4"
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[7px] w-6" : "w-6"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay — editorial, espresso background */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 bg-espresso flex flex-col justify-end pb-16 px-10"
          >
            {/* Small label */}
            <p className="font-cormorant italic text-terracotta text-lg mb-10 tracking-[0.2em]">
              Trebelcafé · Tribsees
            </p>

            {/* Nav items */}
            <nav className="flex flex-col gap-2 mb-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="font-playfair text-cream hover:text-sand transition-colors duration-200 block"
                    style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-dm text-cream/30 text-xs tracking-widest uppercase"
            >
              Do – Mo · 9 – 17 Uhr
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
