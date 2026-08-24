"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { normalizePetaEmbedUrl } from "@/lib/peta-utils";

const tabs = [
  { id: "sejarah", label: "Sejarah" },
  { id: "visimisi", label: "Visi & Misi" },
  { id: "peta", label: "Peta" },
];

export default function ProfileTabs({ desaInfo }) {
  const [activeTab, setActiveTab] = useState("sejarah");
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const sejarahPhotoY = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 80]);

  if (!desaInfo) return <p className="text-center py-20 text-text-secondary">Data tidak tersedia.</p>;

  return (
    <div>
      {/* â”€â”€ Tab Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="px-4 md:px-8 mb-10">
        <div className="inline-flex bg-white shadow-soft rounded-2xl p-1.5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-soft"
                  : "text-text-secondary hover:text-primary hover:bg-background"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* â”€â”€ Tab: Sejarah â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "sejarah" && (
        <section className="pb-20 md:pb-28 max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 min-h-[600px]">
            {/* Left: Photo with Parallax */}
            <div className="w-full md:w-5/12 h-64 md:h-[480px] rounded-3xl overflow-hidden shadow-large relative bg-surface-container">
              <motion.img
                className="w-full h-full object-cover scale-110"
                style={{ y: sejarahPhotoY }}
                src={desaInfo.fotoSejarahUrl || "https://picsum.photos/600/800?random=50"}
                alt="Sejarah Jorong Padang Panjang"
              />
            </div>

            {/* Right: Text + Timeline */}
            <div className="w-full md:w-7/12 flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <ScrollReveal direction="up">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60 block mb-3">
                    Sejarah Kami
                  </span>
                  <h2
                    className="font-heading font-bold text-text-primary mb-6"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.01em" }}
                  >
                    Sejarah Jorong
                  </h2>
                </ScrollReveal>
                <div className="space-y-4">
                  {desaInfo.sejarah.split("\n\n").map((paragraf, idx) => (
                    <ScrollReveal key={idx} delay={idx * 0.1} direction="up">
                      <p className="text-text-secondary text-base text-justify leading-loose">
                        {paragraf.trim()}
                      </p>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="w-full md:w-52 flex-shrink-0">
                <ScrollReveal direction="left">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.12em] mb-6">
                    Jejak Waktu
                  </h3>
                </ScrollReveal>
                <div className="relative border-l-2 border-primary ml-3 pl-6 space-y-8">
                  {desaInfo.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Gold dot */}
                      <motion.div
                        className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ring-4"
                        style={{
                          backgroundColor: "#F2A65A",
                          ringColor: "rgba(242,166,90,0.25)",
                        }}
                        animate={shouldReduceMotion ? {} : { scale: [1, 1.25, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: idx * 0.3 }}
                      />
                      <ScrollReveal delay={idx * 0.1} direction="left">
                        <h4 className="text-sm font-bold text-primary">{item.tahun}</h4>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                          {item.keterangan || item.deskripsi}
                        </p>
                      </ScrollReveal>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Tab: Visi Misi â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "visimisi" && (
        <section className="pb-20 md:pb-28" style={{ backgroundColor: "#FAFAFA" }}>
          <div className="max-w-[800px] mx-auto px-4 md:px-8 py-12 min-h-[500px] flex flex-col justify-center">
            <ScrollReveal direction="up" className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60 block mb-3">
                Arah & Tujuan
              </span>
              <h2
                className="font-heading font-bold text-text-primary"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", letterSpacing: "-0.01em" }}
              >
                Visi & Misi
              </h2>
            </ScrollReveal>

            {/* Visi Card */}
            <ScrollReveal direction="up" delay={0.1}>
              <div
                className="bg-white rounded-2xl shadow-card p-8 text-center mb-8 border border-border"
              >
                <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-4">
                  Visi
                </h3>
                <p className="text-lg leading-relaxed text-text-primary font-medium">
                  &ldquo;{desaInfo.visi}&rdquo;
                </p>
              </div>
            </ScrollReveal>

            {/* Misi List */}
            <div>
              <ScrollReveal direction="up" delay={0.2}>
                <h3 className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-6 text-center">
                  Misi
                </h3>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {desaInfo.misi.map((item, idx) => (
                  <ScrollReveal key={idx} delay={0.2 + idx * 0.08} direction="up">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white hover:bg-surface-container-low border border-border transition-colors shadow-soft">
                      <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: "rgba(0,70,67,0.08)", color: "#004643" }}>
                        <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary text-sm mb-1">{item.judul}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{item.deskripsi}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Tab: Peta â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === "peta" && (
        <section className="pb-20 md:pb-28 max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          <ScrollReveal direction="up">
            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary/60 block mb-3">
                Lokasi
              </span>
              <h2
                className="font-heading font-bold text-text-primary"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.01em" }}
              >
                Peta Wilayah
              </h2>
              <p className="text-text-secondary mt-2 text-sm">
                {desaInfo.geografis || "Terletak di ketinggian 500â€“700 mdpl dengan topografi berbukit-bukit."}
              </p>
            </div>
          </ScrollReveal>

          {/* Google Maps iframe */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-card bg-surface-container border border-border">
              <iframe
                src={normalizePetaEmbedUrl(desaInfo?.petaEmbedUrl) || "https://maps.google.com/maps?q=Kantor%20Wali%20Nagari%20Pariangan%20Tanah%20Datar&t=&z=16&ie=UTF8&iwloc=&output=embed"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Peta Pariangan"
              />
            </div>
          </ScrollReveal>

          {/* Alamat + batas wilayah */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal direction="left" delay={0.2} className="w-full">
              <div className="bg-white rounded-2xl p-6 shadow-card border border-border h-full">
                <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_city</span>
                  Alamat Kantor
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {desaInfo.alamat}
                </p>
              </div>
            </ScrollReveal>

            {desaInfo.batasWilayah && (
              <ScrollReveal direction="right" delay={0.2} className="w-full">
                <div className="bg-white rounded-2xl p-6 shadow-card border border-border h-full">
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-primary text-[20px]">explore</span>
                    Batas Wilayah
                  </h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li><strong className="text-text-primary">Utara:</strong> {desaInfo.batasWilayah.utara}</li>
                    <li><strong className="text-text-primary">Selatan:</strong> {desaInfo.batasWilayah.selatan}</li>
                    <li><strong className="text-text-primary">Timur:</strong> {desaInfo.batasWilayah.timur}</li>
                    <li><strong className="text-text-primary">Barat:</strong> {desaInfo.batasWilayah.barat}</li>
                  </ul>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
