"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import GalleryCard from "@/components/GalleryCard";
import HeroParallax from "@/components/HeroParallax";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomeClient({ produkPreview, galeriPreview, desaInfo }) {
  const heroImage = desaInfo?.fotoHeroUrl || "https://picsum.photos/1600/900?random=100";

  return (
    <>
      {/* Hero Section */}
      <HeroParallax
        imageUrl={heroImage}
        overlayClass="bg-gradient-to-r from-primary to-primary-container opacity-90 z-10 mix-blend-multiply"
      >
        <div className="text-center px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto">
          <ScrollReveal>
            <h1 className="font-hero-lg-mobile md:font-hero-lg text-hero-lg-mobile md:text-hero-lg text-on-primary mb-md drop-shadow-md">
              Jorong Padang Panjang Pariangan
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <p className="font-section-title text-section-title text-on-primary font-normal drop-shadow-sm">
              {desaInfo?.tagline || "Merawat Tradisi di Nagari Tuo, Membangun Kemandirian yang Lestari."}
            </p>
          </ScrollReveal>
        </div>
      </HeroParallax>

      <main>
        {/* Sejarah Preview */}
        <section className="py-xl max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop min-h-[300px] flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center w-full">
            <ScrollReveal className="md:col-span-5">
              <div className="h-[250px] md:h-[300px] rounded-xl overflow-hidden shadow-sm relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={desaInfo?.fotoSejarahUrl || "https://picsum.photos/600/800?random=50"}
                  alt="Sejarah Jorong Padang Panjang Pariangan"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150} className="md:col-span-7 flex flex-col justify-center gap-md">
              <h2 className="font-section-title text-section-title text-primary">Sejarah Singkat</h2>
              <p className="text-on-surface-variant max-w-[600px]">
                Nagari Pariangan dikenal secara luas dalam tambo Minangkabau sebagai Nagari Tuo,
                tempat asal mula peradaban Minangkabau berkembang dari puncak Gunung Marapi. Jorong
                Padang Panjang Pariangan merupakan salah satu wilayah adat penting yang ikut menjaga kelestarian
                tatanan adat Sarat Nan Ampek.
              </p>
              <div>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-base text-primary font-label-sm text-label-sm font-semibold hover:underline"
                >
                  Baca Selengkapnya{" "}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Produk Preview */}
        <section className="py-xl bg-surface-dim min-h-[400px] relative gradient-radial-gold">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <ScrollReveal className="text-center mb-lg">
              <h2 className="font-section-title text-section-title text-primary">
                Produk Unggulan Desa
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {produkPreview.map((produk) => (
                <ScrollReveal key={produk.id} delay={100}>
                  <ProductCard produk={produk} onDetailClick={() => {}} />
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal delay={200} className="mt-lg text-center">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center px-6 py-3 bg-white border border-outline text-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-variant transition-colors duration-200"
              >
                Lihat Semua Produk
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Galeri Preview */}
        <section className="py-xl bg-surface-container-lowest min-h-[400px] gradient-radial-primary">
          <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <ScrollReveal className="flex justify-between items-end mb-lg">
              <h2 className="font-section-title text-section-title text-primary">
                Galeri Kegiatan
              </h2>
              <Link
                href="/galeri"
                className="hidden md:inline-flex items-center gap-base text-primary font-label-sm text-label-sm hover:underline"
              >
                Buka Galeri{" "}
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-sm md:gap-md">
              {galeriPreview.map((item) => (
                <ScrollReveal key={item.id} delay={80}>
                  <GalleryCard item={item} onClick={() => {}} />
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-md text-center md:hidden">
              <Link
                href="/galeri"
                className="inline-flex items-center gap-base text-primary font-label-sm text-label-sm hover:underline"
              >
                Buka Galeri{" "}
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="h-[250px] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container to-primary z-0"></div>
          <div className="relative z-10 text-center px-margin-mobile">
            <h2 className="font-section-title text-section-title text-on-primary mb-md drop-shadow-sm">
              Ingin Tahu Lebih Lanjut?
            </h2>
            <Link
              href="/kontak"
              className="cta-glow inline-block px-8 py-4 bg-surface-container-lowest text-primary font-label-sm text-label-sm font-bold rounded-xl shadow-sm hover:bg-surface-variant transition-colors duration-200"
            >
              Hubungi Kami Sekarang
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
