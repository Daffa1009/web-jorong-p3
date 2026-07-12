"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProdukClient({ produkList, kategoriProduk }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedProduk, setSelectedProduk] = useState(null);

  const filtered =
    filter === "Semua"
      ? produkList
      : produkList.filter((p) => p.kategori === filter);

  // Data modal (deskripsiLengkap fallback deskripsi)
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
      {/* Filter */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-sm min-w-max px-margin-mobile md:px-margin-desktop py-md justify-center">
          {kategoriProduk.map((kat) => (
            <button
              key={kat}
              onClick={() => setFilter(kat)}
              className={`px-5 py-2 rounded-full font-label-sm text-label-sm border transition-colors duration-200 ${
                filter === kat
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {filtered.map((produk) => (
          <ProductCard
            key={produk.id}
            produk={produk}
            onDetailClick={() => setSelectedProduk(produk)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-on-surface-variant font-body-md">
            Tidak ada produk untuk kategori ini.
          </p>
        )}
      </div>

      {/* Modal Detail */}
      {produkDetail && (
        <div
          className="fixed inset-0 z-50 bg-on-background/60 backdrop-blur-sm flex items-center justify-center px-margin-mobile py-xl animate-fadeIn"
          onClick={() => setSelectedProduk(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-[600px] w-full max-h-[80vh] overflow-y-auto modal-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-lg">
              <button
                onClick={() => setSelectedProduk(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <div className="w-full h-56 rounded-lg overflow-hidden mb-md">
                <img
                  className="w-full h-full object-cover"
                  src={produkDetail.foto || "https://picsum.photos/600/400?random=23"}
                  alt={produkDetail.nama}
                />
              </div>

              <div className="mb-4">
                <span className="px-3 py-1 bg-primary-container/10 text-primary rounded-full font-label-sm text-label-sm">
                  {produkDetail.kategori}
                </span>
                <h3 className="font-section-title text-section-title text-on-surface mt-2">
                  {produkDetail.nama}
                </h3>
                {produkDetail.pengrajin && (
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Oleh: {produkDetail.pengrajin}
                  </p>
                )}
                {produkDetail.harga && (
                  <p className="font-section-title text-primary mt-2">
                    {produkDetail.harga}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-label-sm text-label-sm font-bold text-on-surface mb-2">
                  Deskripsi
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
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
