"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

  // Scroll-aware navbar (B4)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`navbar sticky top-0 w-full h-[80px] z-50 bg-surface-container-lowest ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="flex justify-between items-center h-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Brand */}
        <Link
          href="/"
          className="font-section-title text-section-title font-bold text-on-surface"
        >
          Jorong Padang Panjang Pariangan
        </Link>

        {/* Desktop Nav (B4: animated underline) */}
        <div className="hidden md:flex gap-gutter items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link font-body-md text-body-md transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-primary font-semibold active"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-[28px]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu (B4: slide-in) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[80px] z-40 bg-on-background/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="mobile-menu-panel absolute top-0 right-0 w-[260px] max-w-[80vw] h-[calc(100vh-80px)] bg-surface-container-lowest border-l border-outline-variant/30 shadow-xl px-margin-mobile py-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body-md text-body-md py-2 transition-colors ${
                    isActive(link.href)
                      ? "text-primary font-bold border-l-4 border-primary pl-3"
                      : "text-on-surface hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
