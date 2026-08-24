"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HeroParallax from "@/components/HeroParallax";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeClient({ produkPreview, galeriPreview, desaInfo }) {
  const heroImage = desaInfo?.fotoHeroUrl || "https://picsum.photos/1600/900?random=100";

  // Lightbox State
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Dapatkan daftar foto dari kegiatan terpilih
  const getPhotos = (item) => {
    if (!item) return [];
    const cover = item.foto_cover || item.foto_url || item.foto;
    const additional = (item.fotos || []).map(f => f.foto_url);
    return [cover, ...additional].filter(Boolean);
  };

  const photos = selectedMedia ? getPhotos(selectedMedia) : [];

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
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
    <>
      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <HeroParallax
        imageUrl={heroImage}
        overlayClass=""
      >
        {/* Overlay gradient: Cyprus 90% kiri → 40% kanan */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,70,67,0.92) 0%, rgba(0,70,67,0.45) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative z-20 max-w-[1280px] mx-auto px-4 md:px-8 pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col md:flex-row items-center gap-12 md:gap-16 min-h-screen">
          {/* Left: Text */}
          <div className="flex-1 flex flex-col gap-6 text-left">
            {/* Badge */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm w-fit">
                <span className="text-sm">🌿</span>
                <span className="text-sm font-medium text-white/90 tracking-wide">
                  Nagari Tuo Minangkabau
                </span>
              </div>
            </ScrollReveal>

            {/* H1 */}
            <ScrollReveal delay={0.1}>
              <h1
                className="font-heading font-extrabold text-white leading-tight"
                style={{
                  fontSize: "clamp(2.4rem, 6vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Jorong Padang Panjang
                <br />
                <span className="text-gold">Pariangan</span>
              </h1>
            </ScrollReveal>

            {/* Tagline */}
            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed">
                {desaInfo?.tagline ||
                  "Merawat Tradisi di Nagari Tuo, Membangun Kemandirian yang Lestari."}
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm text-white shadow-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: "#F2A65A" }}
                >
                  Kenali Kami
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm text-white border border-white/40 hover:bg-white/10 transition-all duration-200"
                >
                  Hubungi Kami
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Decorative photo (desktop only) */}
          <ScrollReveal delay={0.2} direction="left" className="hidden md:block flex-shrink-0">
            <div
              className="relative w-[360px] h-[420px] rounded-3xl overflow-hidden shadow-large"
              style={{ transform: "rotate(-2deg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  desaInfo?.fotoSejarahUrl ||
                  "https://picsum.photos/720/840?random=77"
                }
                alt="Pemandangan Jorong Padang Panjang"
                className="w-full h-full object-cover"
              />
              {/* subtle inner overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,70,67,0.35) 0%, transparent 60%)",
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </HeroParallax>

      <main>
        {/* ── STATS BAR ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section
            className="bg-white shadow-soft relative z-10 -mt-1"
            style={{ borderTop: "3px solid #F2A65A" }}
          >
            <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
              {[
                { nilai: "500+", label: "Warga" },
                { nilai: "3", label: "Dusun" },
                { nilai: "±600 mdpl", label: "Ketinggian" },
                { nilai: "Abad ke-14", label: "Berdiri Sejak" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-4 px-4 gap-1">
                  <span
                    className="font-heading font-bold text-primary"
                    style={{ fontSize: "clamp(1.4rem, 3vw, 1.875rem)" }}
                  >
                    {stat.nilai}
                  </span>
                  <span className="text-sm text-text-muted font-medium text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ── SEJARAH SINGKAT SECTION ──────────────────────────── */}
        <section className="py-20 md:py-28 max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center w-full">
            {/* Foto kiri dengan frame dekoratif gold */}
            <ScrollReveal className="md:col-span-5">
              <div className="sejarah-frame relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-large group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={desaInfo?.fotoSejarahUrl || "https://picsum.photos/600/800?random=50"}
                  alt="Sejarah Jorong Padang Panjang Pariangan"
                />
              </div>
            </ScrollReveal>

            {/* Konten kanan */}
            <ScrollReveal delay={0.15} className="md:col-span-7 flex flex-col justify-center gap-6">
              {/* Badge section */}
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60">
                Sejarah Kami
              </span>

              <h2
                className="font-heading font-bold text-text-primary"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
              >
                Nagari Tuo Minangkabau
              </h2>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg max-w-[560px]">
                Nagari Pariangan dikenal secara luas dalam tambo Minangkabau sebagai Nagari Tuo,
                tempat asal mula peradaban Minangkabau berkembang dari puncak Gunung Marapi. Jorong
                Padang Panjang Pariangan merupakan salah satu wilayah adat penting yang ikut menjaga
                kelestarian tatanan adat Sarat Nan Ampek.
              </p>

              <Link
                href="/profil"
                className="link-underline-primary inline-flex items-center gap-2 text-primary font-semibold text-sm w-fit hover:gap-3 transition-all duration-200"
              >
                Baca Selengkapnya
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* ── PRODUK UNGGULAN SECTION ──────────────────────────── */}
        <section className="py-20 md:py-28 relative" style={{ backgroundColor: "#FAFAFA" }}>
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
            {/* Header: badge + H2 + link "Lihat Semua →" */}
            <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60 block mb-3">
                  Unggulan Desa
                </span>
                <h2
                  className="font-heading font-bold text-text-primary"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
                >
                  Produk Unggulan
                </h2>
                <p className="text-text-secondary mt-2 text-base max-w-lg">
                  Hasil karya dan produk kebanggaan masyarakat Jorong Padang Panjang.
                </p>
              </div>
              <Link
                href="/produk"
                className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all duration-200 shrink-0"
              >
                Lihat Semua
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </ScrollReveal>

            {/* Grid produk */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {produkPreview.map((produk, index) => (
                <ScrollReveal key={produk.id} delay={index * 0.1}>
                  <ProductCard produk={produk} onDetailClick={() => {}} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALERI SECTION (STACKED CARDS) ───────────────────── */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <ScrollReveal className="flex justify-between items-end mb-14">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60 block mb-3">
                  Dokumentasi
                </span>
                <h2
                  className="font-heading font-bold text-text-primary"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
                >
                  Galeri Kegiatan
                </h2>
                <p className="text-text-secondary mt-2 text-base">
                  Momen-momen kebersamaan pembangunan dan kebudayaan desa kami.
                </p>
              </div>
              <Link
                href="/galeri"
                className="hidden md:inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all duration-200"
              >
                Buka Galeri
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </ScrollReveal>

            {/* Grid Stacked Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 pt-4 pb-8">
              {galeriPreview.map((item, index) => {
                const cover = item.foto_cover || item.foto_url || item.foto;
                const f2 = item.fotos?.[1]?.foto_url || cover;
                const f3 = item.fotos?.[2]?.foto_url || cover;
                const jumlahFoto = 1 + (item.fotos ? item.fotos.length : 0);

                return (
                  <ScrollReveal key={item.id} delay={index * 0.08} direction="up" className="flex justify-center">
                    <div
                      onClick={() => {
                        setSelectedMedia(item);
                        setActiveIndex(0);
                      }}
                      className="relative w-full aspect-[4/3] max-w-[260px] group cursor-pointer"
                    >
                      {/* Foto ke-3 (paling belakang) */}
                      <div className="absolute top-4 left-4 w-full h-full rounded-2xl overflow-hidden rotate-6 opacity-60 shadow-md transition-all duration-300 group-hover:rotate-12 group-hover:translate-x-3 group-hover:translate-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f3} alt="" className="w-full h-full object-cover" />
                      </div>
                      {/* Foto ke-2 */}
                      <div className="absolute top-2 left-2 w-full h-full rounded-2xl overflow-hidden -rotate-3 opacity-85 shadow-lg transition-all duration-300 group-hover:-rotate-6 group-hover:translate-x-1.5 group-hover:-translate-y-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f2} alt="" className="w-full h-full object-cover" />
                      </div>
                      {/* Foto utama (paling depan) */}
                      <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden rotate-0 shadow-xl transition-all duration-300 group-hover:scale-[1.01] group-hover:-translate-y-3 group-hover:shadow-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cover} alt={item.judul} className="w-full h-full object-cover" />
                        {/* Overlay info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                          <p className="text-gold text-xs font-bold uppercase tracking-wider mb-1">
                            {item.kategori}
                          </p>
                          <p className="text-white text-sm font-semibold line-clamp-1">{item.judul}</p>
                          <p className="text-white/70 text-xs mt-0.5">📷 {jumlahFoto} foto</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}

              {galeriPreview.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="grid grid-cols-4 gap-6 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full aspect-[4/3] rounded-2xl skeleton"></div>
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm mt-4">Memuat galeri kegiatan...</p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-1 text-primary font-semibold text-sm"
              >
                Buka Galeri
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ──────────────────────────────────────── */}
        <section className="relative flex items-center justify-center overflow-hidden py-24 md:py-32">
          {/* Gradient background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(135deg, #004643 0%, #002E2C 100%)",
            }}
          />
          {/* Subtle dot pattern overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          {/* Gold accent circle */}
          <div
            className="absolute right-0 top-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ backgroundColor: "#F2A65A" }}
            aria-hidden="true"
          />

          <div className="relative z-10 text-center px-4 md:px-8 max-w-2xl mx-auto">
            <ScrollReveal>
              <h2
                className="font-heading font-bold text-white mb-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.01em" }}
              >
                Ingin Tahu Lebih Lanjut?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Sampaikan aspirasi, pertanyaan, atau kunjungi kami langsung di
                Kantor Nagari Pariangan.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white shadow-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: "#F2A65A" }}
              >
                Hubungi Kami Sekarang
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ── LIGHTBOX MODAL ───────────────────────────────────── */}
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

            {/* Main Image View */}
            <div className="relative flex-1 flex items-center justify-center p-4 bg-black/20 min-h-[300px] md:min-h-[450px]">
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[26px]">chevron_left</span>
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="max-w-full max-h-[50vh] md:max-h-[55vh] object-contain rounded-lg animate-fadeIn"
                src={photos[activeIndex]}
                alt={`${selectedMedia.judul} - ${activeIndex + 1}`}
              />

              <button
                onClick={handleNext}
                className="absolute right-4 z-10 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
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
    </>
  );
}
