"use client";

import { useState, useEffect, useCallback } from "react";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i === null ? 0 : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setLightbox((i) => (i === null ? 0 : (i + 1) % images.length)), [images.length]);

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
      {/* Grid */}
      <div className="grid grid-cols-3 gap-3 rounded-2xl overflow-hidden h-72">
        <div
          className="col-span-2 relative overflow-hidden cursor-pointer"
          onClick={() => setLightbox(0)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
        </div>
        <div className="grid grid-rows-2 gap-3 h-full">
          {images.slice(1, 3).map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer h-full"
              onClick={() => setLightbox(i + 1)}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              {/* "Alle Fotos" badge on last visible thumbnail */}
              {i === 1 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="font-dm text-xs text-white">+{images.length - 2} Fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white font-dm text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            ✕ Schließen
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-dm text-xs text-white/50">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={images[lightbox]}
            alt={alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-lg"
          >
            ›
          </button>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                    i === lightbox ? "border-terracotta scale-110" : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
