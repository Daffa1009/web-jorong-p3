"use client";

import { useState } from "react";

export default function KontakClient({ desaInfo }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi kirim (demo — tidak ada backend)
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const sm = desaInfo?.sosialMedia || {};
  const jam = desaInfo?.jamOperasional || {};
  const petaSrc = `https://maps.google.com/maps?q=Kantor%20Wali%20Nagari%20Pariangan%20Tanah%20Datar&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg md:gap-gutter">
        {/* Left: Info */}
        <div className="space-y-lg">
          {/* Alamat */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
            <div className="flex items-start gap-sm mb-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">location_on</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface">Alamat</h3>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {desaInfo?.alamat || "Kantor Wali Nagari Pariangan berlokasi di Nagari Pariangan, Kecamatan Pariangan, Kabupaten Tanah Datar, Provinsi Sumatera Barat, dengan kode pos 27264"}
            </p>
            <a
              href={`https://maps.app.goo.gl/TK7UA9JSce3Z3xzm7?g_st=aw`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-md inline-flex items-center text-primary font-label-sm text-label-sm hover:underline"
            >
              <span className="material-symbols-outlined text-[18px] mr-1">open_in_new</span>
              Buka di Google Maps
            </a>
          </div>

          {/* Kontak */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
            <div className="flex items-start gap-sm mb-md">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">contact_phone</span>
              </div>
              <div>
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface">Kontak</h3>
              </div>
            </div>
            <div className="space-y-3">
              {desaInfo?.telepon && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">call</span>
                  <a href={`tel:${desaInfo.telepon.replace(/[^\d+]/g, "")}`} className="text-primary font-label-sm text-label-sm hover:underline">
                    {desaInfo.telepon}
                  </a>
                </div>
              )}
              {desaInfo?.email && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">mail</span>
                  <a href={`mailto:${desaInfo.email}`} className="text-primary font-label-sm text-label-sm hover:underline">
                    {desaInfo.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">schedule</span>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {jam.seninKamis || jam.seninJumat || jam.senin_jumat || "08:00 - 16:00"} |{" "}
                  {jam.jumat || jam.jumat || ""} |{" "}
                  {jam.akhirPekan || jam.akhirPekan || jam.sabtu_minggu || "Tutup"}
                </p>
              </div>
            </div>
          </div>

          {/* Sosial Media */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">Sosial Media</h3>
            <div className="flex flex-wrap gap-sm">
              {sm.instagram && (
                <a
                  href={sm.instagram.startsWith("http") ? sm.instagram : `https://www.instagram.com/daff4aaa?igsh=ZzB3MzF5d3Jyb3c3/${sm.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-surface-container-low hover:bg-surface rounded-lg text-on-surface-variant font-label-sm text-label-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  Instagram
                </a>
              )}
              {sm.facebook && (
                <a
                  href={sm.facebook.startsWith("http") ? sm.facebook : `https://facebook.com/${sm.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-surface-container-low hover:bg-surface rounded-lg text-on-surface-variant font-label-sm text-label-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Facebook
                </a>
              )}
              {sm.whatsapp && (
                <a
                  href={sm.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-4 py-2 bg-surface-container-low hover:bg-surface rounded-lg text-on-surface-variant font-label-sm text-label-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Peta + Form */}
        <div className="space-y-lg">
          {/* Peta */}
          <div className="w-full h-[250px] rounded-lg overflow-hidden shadow-sm border border-outline-variant/30">
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

          {/* Form Kontak */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
            <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
              Kirim Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Nama"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-glow w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface font-body-md text-body-md"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-glow w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface font-body-md text-body-md"
              />
              <textarea
                required
                placeholder="Isi pesan..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="form-glow w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface font-body-md text-body-md resize-y"
              />
              {submitted && (
                <p className="text-primary flex items-center gap-1 font-label-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Pesan terkirim! (Simulasi)
                </p>
              )}
              <button
                type="submit"
                className="gradient-primary-button text-on-primary px-6 py-2.5 rounded-xl font-label-sm text-label-sm w-full shadow-sm"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
