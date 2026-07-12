"use client";

import { useEffect, useState } from "react";

/**
 * Hero dengan parallax ringan: background image bergerak lebih lambat
 * saat di-scroll. Matikan di mobile (<=640px) untuk performa.
 */
export default function HeroParallax({ imageUrl, children, overlayClass = "" }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip parallax di mobile
    if (window.matchMedia("(max-width: 640px)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hanya berlaku saat hero masih terlihat (y < ~700)
        if (y < 700) setOffset(y * 0.35);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          transform: `translate3d(0, ${offset}px, 0) scale(1.1)`,
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      {/* Overlay */}
      <div className={`absolute inset-0 z-10 ${overlayClass}`} aria-hidden="true" />
      {/* Konten */}
      <div className="relative z-20 w-full">{children}</div>
      {/* Fade transition bawah (B2) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-surface z-15 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
