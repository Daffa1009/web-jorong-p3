"use client";

import { useState, useRef, useEffect } from "react";

const tabs = [
  { id: "sejarah", label: "Sejarah" },
  { id: "visimisi", label: "Visi & Misi" },
  { id: "peta", label: "Peta" },
];

export default function ProfileTabs({ desaInfo }) {
  const [activeTab, setActiveTab] = useState("sejarah");
  const sejarahRef = useRef(null);

  // Timeline staggered animation (B5): observer untuk class
  useEffect(() => {
    if (activeTab !== "sejarah") return;
    const dots = document.querySelectorAll(".timeline-dot");
    if (!dots.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.transitionDelay = `${idx * 150}ms`;
            el.classList.add("timeline-visible-dot");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    dots.forEach((dot) => obs.observe(dot));
    return () => obs.disconnect();
  }, [activeTab]);

  if (!desaInfo) return <p className="text-center py-xl">Data tidak tersedia.</p>;

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex border-b border-outline-variant mb-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-label-sm text-label-sm font-semibold transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Sejarah */}
      {activeTab === "sejarah" && (
        <section className="py-xl max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop" ref={sejarahRef}>
          <div className="flex flex-col md:flex-row gap-lg md:gap-gutter min-h-[600px]">
            {/* Left: Photo */}
            <div className="w-full md:w-5/12 h-64 md:h-auto rounded-lg overflow-hidden shadow-sm">
              <img
                className="w-full h-full object-cover"
                src={desaInfo.fotoSejarahUrl || "https://picsum.photos/600/800?random=50"}
                alt="Sejarah Jorong Padang Panjang"
              />
            </div>

            {/* Right: Text + Timeline */}
            <div className="w-full md:w-7/12 flex flex-col md:flex-row gap-lg">
              <div className="flex-1">
                <h2 className="font-section-title text-section-title text-primary mb-md">
                  Sejarah Jorong
                </h2>
                {desaInfo.sejarah.split("\n\n").map((paragraf, idx) => (
                  <p key={idx} className="font-body-md text-body-md text-on-surface mb-sm text-justify">
                    {paragraf.trim()}
                  </p>
                ))}
              </div>

              {/* Timeline (B5: staggered fade-in) */}
              <div className="w-full md:w-48 flex-shrink-0">
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface-variant mb-md uppercase tracking-wider">
                  Jejak Waktu
                </h3>
                <div className="relative border-l-2 border-outline-variant/50 ml-3 pl-6 space-y-8">
                  {desaInfo.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-surface timeline-dot ${
                          idx === 0
                            ? "bg-primary timeline-visible-dot"
                            : "bg-surface-variant border-2 border-primary"
                        }`}
                      ></div>
                      <h4
                        className={`font-label-sm text-label-sm font-bold ${idx === 0 ? "text-primary" : "text-on-surface"}`}
                      >
                        {item.tahun}
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {item.keterangan || item.deskripsi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Visi Misi */}
      {activeTab === "visimisi" && (
        <section className="py-xl bg-surface-container-lowest">
          <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop min-h-[500px] flex flex-col justify-center">
            <div className="text-center mb-lg">
              <h2 className="font-section-title text-section-title text-on-surface">Visi & Misi</h2>
            </div>

            {/* Visi Card */}
            <div className="bg-surface-container-low rounded-lg shadow-sm p-lg text-center mb-lg border border-outline-variant/20">
              <h3 className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest mb-sm">
                Visi
              </h3>
              <p className="font-section-title text-[20px] leading-relaxed text-on-surface font-medium">
                &ldquo;{desaInfo.visi}&rdquo;
              </p>
            </div>

            {/* Misi List */}
            <div>
              <h3 className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest mb-md text-center">
                Misi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {desaInfo.misi.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-sm p-4 rounded-lg hover:bg-surface-container transition-colors"
                  >
                    <div className="p-2 bg-primary-container/10 text-primary rounded-lg shrink-0">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-label-sm text-label-sm font-bold text-on-surface mb-1">
                        {item.judul}
                      </h4>
                      <p className="text-sm text-on-surface-variant">{item.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab: Peta */}
      {activeTab === "peta" && (
        <section className="py-xl max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="mb-lg">
            <h2 className="font-section-title text-section-title text-on-surface">Peta Wilayah</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {desaInfo.geografis ||
                "Terletak di ketinggian 500–700 mdpl dengan topografi berbukit-bukit."}
            </p>
          </div>

          {/* Google Maps iframe */}
          <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-sm bg-surface-container border border-outline-variant/30">
            <iframe
              src="https://maps.google.com/maps?q=Kantor%20Wali%20Nagari%20Pariangan%20Tanah%20Datar&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Peta Pariangan"
            />
          </div>

          {/* Alamat + batas wilayah */}
          <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="bg-surface-container-lowest rounded-lg p-md shadow-sm border border-outline-variant/20">
              <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_city</span>
                Alamat Kantor
              </h3>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {desaInfo.alamat}
              </p>
            </div>

            {desaInfo.batasWilayah && (
              <div className="bg-surface-container-lowest rounded-lg p-md shadow-sm border border-outline-variant/20">
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">explore</span>
                  Batas Wilayah
                </h3>
                <ul className="space-y-1 font-body-md text-sm text-on-surface-variant">
                  <li><strong>Utara:</strong> {desaInfo.batasWilayah.utara}</li>
                  <li><strong>Selatan:</strong> {desaInfo.batasWilayah.selatan}</li>
                  <li><strong>Timur:</strong> {desaInfo.batasWilayah.timur}</li>
                  <li><strong>Barat:</strong> {desaInfo.batasWilayah.barat}</li>
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
