"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function ProdukClient({ produkList, kategoriProduk }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedProduk, setSelectedProduk] = useState(null);

  const filtered =
    filter === "Semua"
      ? produkList
      : produkList.filter((p) => p.kategori === filter);

  const produkDetail = selectedProduk
    ? {
        nama: selectedProduk.nama,
        kategori: selectedProduk.kategori,
        foto: selectedProduk.foto_url || selectedProduk.foto,
        pengrajin: selectedProduk.pengrajin,
        deskripsiTotal:
          selectedProduk.deskripsiLengkap || selectedProduk.deskripsi || "",
        harga: selectedProduk.harga,
      }
    : null;

  return (
    <div>
      {/* ── Filter Pills ──────────────────────────────────── */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max px-4 md:px-8 py-6 justify-center">
          {kategoriProduk.map((kat) => (
            <button
              key={kat}
              onClick={() => setFilter(kat)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                filter === kat
                  ? "bg-primary text-white border-primary shadow-soft"
                  : "bg-white border-border text-text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filtered.map((produk, index) => (
          <ScrollReveal key={produk.id} delay={index * 0.1} direction="up">
            <ProductCard
              produk={produk}
              onDetailClick={() => setSelectedProduk(produk)}
            />
          </ScrollReveal>
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-text-secondary py-12">
            Tidak ada produk untuk kategori ini.
          </p>
        )}
      </div>

      {/* ── Modal Detail ──────────────────────────────────── */}
      {produkDetail && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center px-4 py-16 animate-fadeIn"
          style={{ backgroundColor: "rgba(13,27,30,0.55)" }}
          onClick={() => setSelectedProduk(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[80vh] overflow-y-auto modal-scroll border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 md:p-8">
              <button
                onClick={() => setSelectedProduk(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary bg-background hover:bg-surface-container rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <div className="w-full h-56 rounded-2xl overflow-hidden mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={produkDetail.foto || "https://picsum.photos/600/400?random=23"}
                  alt={produkDetail.nama}
                />
              </div>

              <div className="mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-primary" style={{ backgroundColor: "rgba(0,70,67,0.10)" }}>
                  {produkDetail.kategori}
                </span>
                <h3 className="font-heading font-bold text-text-primary text-xl mt-3">
                  {produkDetail.nama}
                </h3>
                {produkDetail.pengrajin && (
                  <p className="text-sm text-text-secondary mt-1">
                    Oleh: {produkDetail.pengrajin}
                  </p>
                )}
                {produkDetail.harga && (
                  <p className="font-bold text-primary text-lg mt-2">
                    {produkDetail.harga}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-text-primary text-sm mb-2">Deskripsi</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {produkDetail.deskripsiTotal}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
