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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navBg =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-cream/95 backdrop-blur-sm shadow-sm";

  const linkColor =
    isHome && !scrolled ? "text-white" : "text-espresso";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-playfair text-xl font-semibold ${linkColor} transition-colors duration-300`}
          >
            Trebelcafé
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-wide ${linkColor} transition-colors duration-300 group`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/reservierung"
              className="ml-2 px-5 py-2 rounded-full bg-terracotta text-white text-sm font-medium hover:bg-[#b3623c] transition-all duration-300 animate-pulse-ring"
            >
              Tisch reservieren
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden flex flex-col gap-1.5 ${linkColor}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="font-playfair text-3xl text-espresso"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.1 }}
            >
              <Link
                href="/reservierung"
                className="mt-4 px-8 py-3 rounded-full bg-terracotta text-white font-medium text-lg"
              >
                Tisch reservieren
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
