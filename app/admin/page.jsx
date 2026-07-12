"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ produk: 0, galeri: 0, info: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/api/admin/produk").then((r) => r.ok ? r.json() : { data: [] }),
      adminFetch("/api/admin/galeri").then((r) => r.ok ? r.json() : { data: [] }),
      adminFetch("/api/admin/info-desa").then((r) => r.ok ? r.json() : { data: null }),
    ])
      .then(([p, g, i]) => {
        setStats({
          produk: p.data?.length || 0,
          galeri: g.data?.length || 0,
          info: Boolean(i.data),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      href: "/admin/produk",
      icon: "inventory_2",
      label: "Produk",
      value: stats.produk,
      desc: "Kelola produk unggulan",
      color: "bg-primary-container/15 text-primary",
    },
    {
      href: "/admin/galeri",
      icon: "photo_library",
      label: "Galeri",
      value: stats.galeri,
      desc: "Kelola foto kegiatan",
      color: "bg-secondary-container/15 text-secondary-container",
    },
    {
      href: "/admin/info-desa",
      icon: "info",
      label: "Info Desa",
      value: stats.info ? "Terisi" : "Kosong",
      desc: "Sejarah, visi-misi, kontak",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div>
      <h1 className="font-section-title text-section-title font-bold text-on-surface mb-lg">
        Dashboard
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
        Selamat datang di panel administrasi Jorong Padang Panjang, Nagari Pariangan.
      </p>

      {loading ? (
        <div className="text-on-surface-variant font-body-md">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-surface-container-lowest rounded-xl p-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-outline-variant/20 hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-md ${card.color}`}>
                <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
              </div>
              <h3 className="font-section-title text-section-title text-on-surface font-bold">
                {card.label}
              </h3>
              <p className="font-label-sm text-label-sm text-primary mb-1">
                {card.value}
              </p>
              <p className="font-body-md text-sm text-on-surface-variant">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
