"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { adminFetch } from "@/lib/admin-fetch";

const KATEGORI_OPTIONS = ["Sosial Kepemudaan", "Pertanian & Ekonomi", "Pemerintahan", "Budaya", "Infrastruktur"];

const DEFAULT_FORM = {
  nama_desa: "",
  tagline: "",
  sejarah_teks: "",
  visi: "",
  misi: [],
  alamat_kantor: "",
  telepon: "",
  email: "",
  jam_operasional: { senin_jumat: "08:00 - 16:00 WIB", sabtu_minggu: "Tutup" },
  instagram: "",
  facebook: "",
  whatsapp: "",
  foto_hero_url: "",
  foto_sejarah_url: "",
  timeline: [],
};

export default function AdminInfoDesaPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/info-desa")
      .then((r) => (r.ok ? r.json() : { data: null }))
      .then((d) => {
        if (d.data) {
          setForm({
            ...DEFAULT_FORM,
            ...d.data,
            misi: Array.isArray(d.data.misi) ? d.data.misi : [],
            timeline: Array.isArray(d.data.timeline) ? d.data.timeline : [],
            jam_operasional: d.data.jam_operasional || DEFAULT_FORM.jam_operasional,
          });
        }
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  // Misi helpers
  const addMisi = () =>
    setForm((f) => ({
      ...f,
      misi: [...f.misi, { judul: "", deskripsi: "", icon: "eco" }],
    }));
  const updateMisi = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      misi: f.misi.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    }));
  const removeMisi = (idx) =>
    setForm((f) => ({ ...f, misi: f.misi.filter((_, i) => i !== idx) }));

  // Timeline helpers
  const addTimeline = () =>
    setForm((f) => ({
      ...f,
      timeline: [...f.timeline, { tahun: "", keterangan: "" }],
    }));
  const updateTimeline = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      timeline: f.timeline.map((t, i) => (i === idx ? { ...t, [field]: value } : t)),
    }));
  const removeTimeline = (idx) =>
    setForm((f) => ({ ...f, timeline: f.timeline.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    setSuccess(false);
    try {
      const res = await adminFetch("/api/admin/info-desa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan");
      }
    } catch {
      setError("Koneksi gagal");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-on-surface-variant">Memuat...</p>;

  return (
    <div>
      <h1 className="font-section-title text-section-title font-bold text-on-surface mb-lg">
        Info Desa
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
        Edit identitas, sejarah, visi-misi, kontak, dan media.
      </p>

      <form onSubmit={handleSubmit} className="max-w-[900px] space-y-xl">
        {/* Identitas */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Identitas
          </h2>
          <div className="space-y-4">
            <Field label="Nama Desa / Jorong">
              <input
                value={form.nama_desa}
                onChange={(e) => setForm({ ...form, nama_desa: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Tagline">
              <input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </section>

        {/* Sejarah */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Sejarah
          </h2>
          <div className="space-y-4">
            <Field label="Teks Sejarah">
              <textarea
                rows={10}
                value={form.sejarah_teks}
                onChange={(e) => setForm({ ...form, sejarah_teks: e.target.value })}
                className={`${inputCls} resize-y`}
                placeholder="Pisahkan paragraf dengan baris kosong"
              />
            </Field>
            <ImageUpload
              value={form.foto_sejarah_url}
              onChange={(url) => setForm({ ...form, foto_sejarah_url: url })}
              label="Foto Sejarah"
              aspect="aspect-[3/4]"
            />
          </div>
        </section>

        {/* Visi */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Visi
          </h2>
          <Field label="Teks Visi">
            <textarea
              rows={3}
              value={form.visi}
              onChange={(e) => setForm({ ...form, visi: e.target.value })}
              className={`${inputCls} resize-y`}
            />
          </Field>
        </section>

        {/* Misi */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-label-sm text-label-sm font-bold text-on-surface">
              Misi
            </h2>
            <button
              type="button"
              onClick={addMisi}
              className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Misi
            </button>
          </div>
          <div className="space-y-3">
            {form.misi.map((m, idx) => (
              <div key={idx} className="bg-surface-container-low p-md rounded-lg border border-outline-variant/20">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-sm">
                  <input
                    placeholder="Judul misi"
                    value={m.judul}
                    onChange={(e) => updateMisi(idx, "judul", e.target.value)}
                    className={`${inputCls} font-semibold`}
                  />
                  <button
                    type="button"
                    onClick={() => removeMisi(idx)}
                    className="self-start px-2 py-2 text-error hover:bg-error-container/20 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                <textarea
                  placeholder="Deskripsi misi"
                  rows={2}
                  value={m.deskripsi}
                  onChange={(e) => updateMisi(idx, "deskripsi", e.target.value)}
                  className={`${inputCls} mt-2 resize-y`}
                />
                <input
                  placeholder="Material symbol icon name"
                  value={m.icon}
                  onChange={(e) => updateMisi(idx, "icon", e.target.value)}
                  className={`${inputCls} mt-2`}
                />
              </div>
            ))}
            {form.misi.length === 0 && (
              <p className="text-on-surface-variant font-label-sm text-label-sm text-center py-md">
                Belum ada misi.
              </p>
            )}
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-label-sm text-label-sm font-bold text-on-surface">
              Timeline / Jejak Waktu
            </h2>
            <button
              type="button"
              onClick={addTimeline}
              className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/20 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah
            </button>
          </div>
          <div className="space-y-3">
            {form.timeline.map((t, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-sm items-start">
                <input
                  placeholder="Tahun / Era"
                  value={t.tahun}
                  onChange={(e) => updateTimeline(idx, "tahun", e.target.value)}
                  className={inputCls}
                />
                <textarea
                  placeholder="Keterangan"
                  rows={2}
                  value={t.keterangan}
                  onChange={(e) => updateTimeline(idx, "keterangan", e.target.value)}
                  className={`${inputCls} resize-y`}
                />
                <button
                  type="button"
                  onClick={() => removeTimeline(idx)}
                  className="self-start px-2 py-2 text-error hover:bg-error-container/20 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}
            {form.timeline.length === 0 && (
              <p className="text-on-surface-variant font-label-sm text-label-sm text-center py-md">
                Belum ada timeline.
              </p>
            )}
          </div>
        </section>

        {/* Kontak */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Kontak
          </h2>
          <div className="space-y-4">
            <Field label="Alamat Kantor">
              <textarea
                rows={2}
                value={form.alamat_kantor}
                onChange={(e) => setForm({ ...form, alamat_kantor: e.target.value })}
                className={`${inputCls} resize-y`}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <Field label="Telepon">
                <input
                  value={form.telepon}
                  onChange={(e) => setForm({ ...form, telepon: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <Field label="Jam Operasional (Senin–Jumat)">
                <input
                  value={form.jam_operasional?.senin_jumat || ""}
                  onChange={(e) => setForm({
                    ...form,
                    jam_operasional: {
                      ...form.jam_operasional,
                      senin_jumat: e.target.value,
                    },
                  })}
                  className={inputCls}
                />
              </Field>
              <Field label="Jam Operasional (Sabtu–Minggu)">
                <input
                  value={form.jam_operasional?.sabtu_minggu || ""}
                  onChange={(e) => setForm({
                    ...form,
                    jam_operasional: {
                      ...form.jam_operasional,
                      sabtu_minggu: e.target.value,
                    },
                  })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Sosial Media */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Sosial Media
          </h2>
          <div className="space-y-4">
            <Field label="Instagram (username atau URL)">
              <input
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className={inputCls}
                placeholder="@username"
              />
            </Field>
            <Field label="Facebook (nama halaman atau URL)">
              <input
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="WhatsApp (URL wa.me)">
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className={inputCls}
                placeholder="https://wa.me/62..."
              />
            </Field>
          </div>
        </section>

        {/* Foto Hero */}
        <section className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20">
          <h2 className="font-label-sm text-label-sm font-bold text-on-surface mb-md">
            Foto Hero Beranda
          </h2>
          <ImageUpload
            value={form.foto_hero_url}
            onChange={(url) => setForm({ ...form, foto_hero_url: url })}
            label="Foto Hero"
            aspect="aspect-[16/9]"
          />
        </section>

        {/* Action */}
        <div className="flex items-center gap-3 pt-md">
          {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
          {success && (
            <p className="text-primary font-label-sm text-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Tersimpan!
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md";

function Field({ label, children }) {
  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface block mb-1">{label}</label>
      {children}
    </div>
  );
}
