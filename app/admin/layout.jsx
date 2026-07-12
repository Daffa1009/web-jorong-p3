"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-fetch";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/produk", label: "Produk", icon: "inventory_2" },
  { href: "/admin/galeri", label: "Galeri", icon: "photo_library" },
  { href: "/admin/forum", label: "Forum", icon: "forum" },
  { href: "/admin/info-desa", label: "Info Desa", icon: "info" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Halaman login tidak pakai sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await adminFetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-surface-dim flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-[240px] bg-primary text-on-primary">
        <div className="px-6 py-6 border-b border-on-primary/20">
          <Link href="/admin" className="font-section-title text-section-title font-bold">
            Admin Panel
          </Link>
          <p className="font-label-sm text-label-sm text-on-primary/70 mt-1">
            Jorong Padang Panjang
          </p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-label-sm transition-colors ${
                isActive(link.href)
                  ? "bg-on-primary/15 text-on-primary font-semibold"
                  : "text-on-primary/80 hover:bg-on-primary/10"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-on-primary/20">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-on-primary/80 hover:text-on-primary font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="mt-1 w-full flex items-center gap-3 px-4 py-2 text-on-primary/80 hover:text-on-primary font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-primary text-on-primary px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-label-sm text-base font-bold">
          Admin Panel
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-[28px]">
            {sidebarOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-on-background/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-[260px] bg-primary text-on-primary py-4 px-4 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-sm text-label-sm ${
                    isActive(link.href)
                      ? "bg-on-primary/15 text-on-primary font-semibold"
                      : "text-on-primary/80"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-on-primary/80 font-label-sm text-label-sm"
              >
                <span className="material-symbols-outlined text-[22px]">logout</span>
                Keluar
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:pt-0 pt-[56px] overflow-x-hidden">
        <div className="px-margin-mobile md:px-margin-desktop py-lg max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
