"use client";

import { useState } from "react";
import GalleryCard from "@/components/GalleryCard";

export default function GaleriClient({ galeriList, kategoriGaleri }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedMedia, setSelectedMedia] = useState(null);

  const filtered =
    filter === "Semua"
      ? galeriList
      : galeriList.filter((g) => g.kategori === filter);

  return (
    <div>
      {/* Filter */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-sm min-w-max px-margin-mobile md:px-margin-desktop py-md justify-center">
          {kategoriGaleri.map((kat) => (
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

      {/* Gallery Grid */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm md:gap-md">
        {filtered.map((item) => (
          <GalleryCard
            key={item.id}
            item={item}
            onClick={() => setSelectedMedia(item)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-on-surface-variant font-body-md">
            Tidak ada foto untuk kategori ini.
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-on-background/80 backdrop-blur-sm flex items-center justify-center px-margin-mobile py-xl animate-fadeIn"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="max-w-[900px] max-h-[80vh] w-full bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-10 text-on-primary bg-on-background/40 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-on-background/60 transition-colors"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              <div className="relative w-full h-auto max-h-[60vh] flex items-center justify-center bg-on-background/5">
                <img
                  className="max-w-full max-h-[60vh] object-contain"
                  src={selectedMedia.foto_url || selectedMedia.foto || ""}
                  alt={selectedMedia.judul}
                />
              </div>

              <div className="p-md">
                <span className="px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-sm text-label-sm">
                  {selectedMedia.kategori}
                </span>
                <h3 className="font-section-title text-section-title text-on-surface mt-2">
                  {selectedMedia.judul}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  {selectedMedia.tanggal || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
