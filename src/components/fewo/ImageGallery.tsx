"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    if (lightbox === null || !thumbsRef.current) return;
    const el = thumbsRef.current.children[lightbox] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [lightbox]);

  const visibleCount = Math.min(images.length, 5);
  const remaining = images.length - visibleCount;

  return (
    <>
      {/* Grid */}
      <div className="grid gap-2 rounded-2xl overflow-hidden" style={{ height: "440px", gridTemplateColumns: "3fr 2fr", gridTemplateRows: "1fr 1fr" }}>
        {/* Hero — spans both rows */}
        <div
          className="relative overflow-hidden cursor-pointer row-span-2 group"
          onClick={() => setLightbox(0)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnails — top-right */}
        {images[1] && (
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => setLightbox(1)}
          >
            <img
              src={images[1]}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        )}

        {/* Bottom-right — overlay badge if more images */}
        {images[2] && (
          <div
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => setLightbox(images.length > visibleCount ? 2 : 2)}
          >
            <img
              src={images[2]}
              alt=""
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {remaining > 0 ? (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                <span className="font-playfair text-2xl text-white">+{remaining}</span>
                <span className="font-dm text-xs text-white/70">weitere Fotos</span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            )}
          </div>
        )}
      </div>

      {/* "Alle Fotos" button */}
      {images.length > 1 && (
        <button
          onClick={() => setLightbox(0)}
          className="mt-3 font-dm text-xs text-espresso/50 hover:text-espresso transition-colors underline underline-offset-4"
        >
          Alle {images.length} Fotos anzeigen
        </button>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/60 hover:text-white font-dm text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            ✕ Schließen
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-dm text-xs text-white/40">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-2xl z-10"
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={images[lightbox]}
            alt={alt}
            className="max-h-[80vh] max-w-[88vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-2xl z-10"
          >
            ›
          </button>

          {/* Thumbnail strip — scrollable */}
          <div
            className="absolute bottom-4 left-0 right-0 px-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={thumbsRef}
              className="flex gap-2 w-max mx-auto"
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`flex-shrink-0 w-14 h-9 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    i === lightbox
                      ? "border-terracotta scale-110 shadow-lg"
                      : "border-white/15 hover:border-white/40 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
