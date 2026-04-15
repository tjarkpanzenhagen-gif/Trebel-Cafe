"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/galerie", label: "Galerie" },
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;
  const isPill = !isTransparent; // pill on scroll OR on non-home pages
  const linkColor = isTransparent ? "text-white" : "text-espresso";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pointer-events-none">
        <motion.div
          animate={
            isPill
              ? { maxWidth: 800, marginTop: 12, borderRadius: 50 }
              : { maxWidth: 1440, marginTop: 0, borderRadius: 0 }
          }
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`mx-auto h-16 flex items-center justify-between px-6 pointer-events-auto transition-[background-color,box-shadow] duration-500 ${
            isPill
              ? "bg-cream/95 backdrop-blur-md shadow-[0_2px_20px_rgba(44,24,16,0.08)]"
              : "bg-transparent"
          }`}
        >
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
        </motion.div>
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
