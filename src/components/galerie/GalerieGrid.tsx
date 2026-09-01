"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
// Image in grid uses next/image; lightbox uses <img> to avoid fill-container sizing constraints

type GalleryImage = { src: string; alt: string };

export default function GalerieGrid({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? 0 : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? 0 : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 py-8">
        {images.map((img, i) => (
          <AnimatedSection key={img.src} delay={i * 0.06} className="break-inside-avoid mb-4">
            <div
              className="relative overflow-hidden rounded-2xl group cursor-pointer"
              onClick={() => setLightbox(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ width: "100%", height: "auto" }}
                className="block group-hover:scale-105 transition-transform duration-700 photo-warm"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-300 flex items-end p-4">
                <p className="font-cormorant italic text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {img.alt}
                </p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white font-dm text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            ✕ Schließen
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-dm text-xs text-white/50">
            {lightbox + 1} / {images.length}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl photo-warm"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
          >
            ›
          </button>
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox ? "bg-white scale-125" : "bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
