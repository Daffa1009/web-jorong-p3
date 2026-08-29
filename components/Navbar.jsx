"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/produk", label: "Produk" },
  { href: "/galeri", label: "Galeri" },
  { href: "/forum", label: "Forum" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Scroll-aware navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navbar transparan (teks putih) HANYA di beranda, karena hero-nya gelap.
  // Halaman lain berlatar putih → langsung pakai navbar solid agar teks terbaca.
  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <nav
      className={`navbar fixed top-0 w-full h-[72px] z-50 transition-all duration-300 ${
        solid ? "scrolled" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center h-full max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="relative w-10 h-10 md:w-12 md:h-12 shrink-0">
            <Image
              src="/logo_desa.png"
              alt="Logo Desa Jorong Padang Panjang"
              fill
              className="object-contain drop-shadow-sm"
              priority
            />
          </div>
          <span className={`font-heading font-bold text-lg md:text-xl leading-tight transition-colors duration-300 hidden sm:block ${
            solid ? "text-primary" : "text-white drop-shadow-sm"
          }`}>
            Jorong Padang Panjang
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link relative text-sm transition-colors duration-200 pb-0.5 ${
                  active
                    ? `${solid ? "text-primary" : "text-white"} font-semibold active`
                    : solid
                    ? "text-text-secondary hover:text-primary"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
                {/* Titik indikator pada menu aktif agar makin jelas */}
                {active && (
                  <span
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: solid ? "#F2A65A" : "#F7C48A" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            solid ? "text-primary hover:bg-primary/10" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-[28px]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu — slide down */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-[72px] z-40 bg-text-primary/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mobile-menu-panel absolute top-3 left-4 right-4 bg-white rounded-2xl shadow-large overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col p-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-text-secondary hover:bg-background hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {/* Titik indikator menu aktif di mobile */}
                      {active && (
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "#F2A65A" }}
                        />
                      )}
                      {link.label}
                    </span>
                    {active && (
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: "#F2A65A" }}
                      >
                        check_circle
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
