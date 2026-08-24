"use client";

import { useState, useEffect } from "react";
import GalleryCard from "@/components/GalleryCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function GaleriClient({ galeriList, kategoriGaleri }) {
  const [filter, setFilter] = useState("Semua");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered =
    filter === "Semua"
      ? galeriList
      : galeriList.filter((g) => g.kategori === filter);

  const getPhotos = () => {
    if (!selectedMedia) return [];
    const cover = selectedMedia.foto_cover || selectedMedia.foto_url || selectedMedia.foto;
    const additional = (selectedMedia.fotos || []).map(f => f.foto_url);
    return [cover, ...additional].filter(Boolean);
  };

  const photos = getPhotos();

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!selectedMedia) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "Escape") setSelectedMedia(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMedia, activeIndex]);

  return (
    <div>
      {/* ── Filter Pills ──────────────────────────────────── */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-3 min-w-max px-4 md:px-8 py-6 justify-center">
          {kategoriGaleri.map((kat) => (
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

      {/* ── Gallery Grid ──────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filtered.map((item, index) => (
          <ScrollReveal key={item.id} delay={index * 0.08} direction="up">
            <GalleryCard
              item={item}
              onClick={() => {
                setSelectedMedia(item);
                setActiveIndex(0);
              }}
            />
          </ScrollReveal>
        ))}
        {filtered.length === 0 && (
          <p className="text-center col-span-full text-text-secondary py-12">
            Tidak ada foto untuk kategori ini.
          </p>
        )}
      </div>

      {/* ── Lightbox ──────────────────────────────────────── */}
      {selectedMedia && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          style={{ backgroundColor: "rgba(13,27,30,0.95)" }}
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-[1000px] w-full bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 text-white">
              <div>
                <span
                  className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full border"
                  style={{
                    backgroundColor: "rgba(0,70,67,0.25)",
                    color: "#99BFBB",
                    borderColor: "rgba(0,70,67,0.4)",
                  }}
                >
                  {selectedMedia.kategori}
                </span>
                <h3 className="font-heading text-base font-bold text-neutral-100 mt-1 line-clamp-1">
                  {selectedMedia.judul}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full">
                  {activeIndex + 1} / {photos.length}
                </span>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Main Image Slider */}
            <div className="relative flex-1 flex items-center justify-center p-4 bg-black/20 min-h-[300px] md:min-h-[450px]">
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="Foto Sebelumnya"
              >
                <span className="material-symbols-outlined text-[26px]">chevron_left</span>
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="max-w-full max-h-[50vh] md:max-h-[55vh] object-contain rounded-lg animate-fadeIn transition-all duration-300"
                src={photos[activeIndex]}
                alt={`${selectedMedia.judul} - ${activeIndex + 1}`}
              />

              <button
                onClick={handleNext}
                className="absolute right-4 z-10 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                aria-label="Foto Selanjutnya"
              >
                <span className="material-symbols-outlined text-[26px]">chevron_right</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="p-4 bg-neutral-950 border-t border-neutral-900 overflow-x-auto no-scrollbar flex justify-center gap-2">
                {photos.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeIndex === index
                        ? "border-gold scale-105"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
