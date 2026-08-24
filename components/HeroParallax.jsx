"use client";

import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";

/**
 * Hero dengan parallax menggunakan Framer Motion.
 * Mendukung prefers-reduced-motion untuk aksesibilitas.
 * Height: min-h-screen dengan overlay gradient Cyprus.
 */
export default function HeroParallax({ imageUrl, children, overlayClass = "" }) {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  // Parallax: bergerak dari y=0 ke y=180 saat scroll mencapai 600px
  const heroY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 180]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: heroY }}
        className="absolute inset-0 z-0 scale-110"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay gradient Cyprus */}
      <div
        className={`absolute inset-0 z-10 ${overlayClass}`}
        aria-hidden="true"
      />

      {/* Konten */}
      <div className="relative z-20 w-full">{children}</div>

      {/* Fade transition bawah */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-15 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(250,250,250,0.9) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
