"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { normalizePetaEmbedUrl } from "@/lib/peta-utils";

export default function KontakClient({ desaInfo }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const sm = desaInfo?.sosialMedia || {};
  const jam = desaInfo?.jamOperasional || {};


  const petaSrc =
    normalizePetaEmbedUrl(desaInfo?.petaEmbedUrl) ||
    `https://maps.google.com/maps?q=Kantor%20Wali%20Nagari%20Pariangan%20Tanah%20Datar&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // Shared input class
  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3 bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:border-primary transition-colors focus:bg-white";

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
        {/* â”€â”€ Left: Info cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="space-y-5">
          {/* Alamat */}
          <ScrollReveal direction="up" delay={0}>
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,70,67,0.10)", color: "#004643" }}
                >
                  <span className="material-symbols-outlined text-[22px]">location_on</span>
                </div>
                <h3 className="font-heading font-semibold text-text-primary pt-2 text-base">Alamat</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {desaInfo?.alamat ||
                  "Kantor Wali Nagari Pariangan berlokasi di Nagari Pariangan, Kecamatan Pariangan, Kabupaten Tanah Datar, Provinsi Sumatera Barat, dengan kode pos 27264"}
              </p>
              <a
                href="https://maps.app.goo.gl/SorN21Bdf9ZqgH4t5"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Buka di Google Maps
              </a>
            </div>
          </ScrollReveal>

          {/* Kontak */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(242,166,90,0.12)", color: "#D4854A" }}
                >
                  <span className="material-symbols-outlined text-[22px]">contact_phone</span>
                </div>
                <h3 className="font-heading font-semibold text-text-primary pt-2 text-base">Kontak</h3>
              </div>
              <div className="space-y-3">
                {desaInfo?.telepon && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[17px] text-text-muted">call</span>
                    <a href={`tel:${desaInfo.telepon.replace(/[^\d+]/g, "")}`} className="text-sm text-primary hover:underline font-medium">
                      {desaInfo.telepon}
                    </a>
                  </div>
                )}
                {desaInfo?.email && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[17px] text-text-muted">mail</span>
                    <a href={`mailto:${desaInfo.email}`} className="text-sm text-primary hover:underline font-medium">
                      {desaInfo.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[17px] text-text-muted">schedule</span>
                  <p className="text-sm text-text-secondary">
                    {jam.seninKamis || jam.seninJumat || jam.senin_jumat || "08:00 - 16:00"}{" "}
                    {jam.jumat ? `| ${jam.jumat}` : ""}{" "}
                    {jam.akhirPekan || jam.sabtu_minggu ? `| ${jam.akhirPekan || jam.sabtu_minggu}` : "| Sabtu-Minggu Tutup"}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Sosial Media */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-heading font-semibold text-text-primary mb-4 text-base">Sosial Media</h3>
              <div className="flex flex-wrap gap-3">
                {sm.instagram && (
                  <a
                    href={sm.instagram.startsWith("http") ? sm.instagram : `https://www.instagram.com/${sm.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-background hover:bg-surface-container-low rounded-xl text-text-secondary text-sm font-medium transition-colors border border-border hover:border-primary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">photo_camera</span>
                    Instagram
                  </a>
                )}
                {sm.facebook && (
                  <a
                    href={sm.facebook.startsWith("http") ? sm.facebook : `https://facebook.com/${sm.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-background hover:bg-surface-container-low rounded-xl text-text-secondary text-sm font-medium transition-colors border border-border hover:border-primary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">group</span>
                    Facebook
                  </a>
                )}
                {sm.whatsapp && (
                  <a
                    href={sm.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-background hover:bg-surface-container-low rounded-xl text-text-secondary text-sm font-medium transition-colors border border-border hover:border-primary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">chat</span>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* â”€â”€ Right: Peta + Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="space-y-5">
          {/* Peta */}
          <ScrollReveal direction="up" delay={0}>
            <div className="w-full h-[260px] rounded-2xl overflow-hidden shadow-card border border-border">
              <iframe
                src={petaSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Peta Pariangan"
              />
            </div>
          </ScrollReveal>

          {/* Form Kontak */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border">
              <h3 className="font-heading font-semibold text-text-primary mb-5 text-base">
                Kirim Pesan
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  placeholder="Nama Anda"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  required
                  type="email"
                  placeholder="Alamat email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
                <textarea
                  required
                  placeholder="Isi pesan Anda..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-y`}
                />
                {submitted && (
                  <p className="text-primary flex items-center gap-1.5 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Pesan terkirim! Kami akan segera merespons.
                  </p>
                )}
                <button
                  type="submit"
                  className="gradient-primary-button text-white px-6 py-3 rounded-xl font-semibold text-sm w-full shadow-soft transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
