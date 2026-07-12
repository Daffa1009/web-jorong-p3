"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { adminFetch } from "@/lib/admin-fetch";

export default function TambahGaleriPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    judul: "",
    kategori: "Sosial Kepemudaan",
    tanggal: "",
    foto_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/galeri");
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

  return (
    <div>
      <Link
        href="/admin/galeri"
        className="inline-flex items-center text-primary font-label-sm text-label-sm hover:underline mb-lg"
      >
        <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
        Kembali
      </Link>

      <h1 className="font-section-title text-section-title font-bold text-on-surface mb-lg">
        Tambah Galeri
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-[900px]">
        <div className="space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Judul</label>
            <input
              required
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Kategori</label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary font-body-md text-body-md"
            >
              <option>Sosial Kepemudaan</option>
              <option>Pertanian & Ekonomi</option>
              <option>Pemerintahan</option>
              <option>Budaya</option>
              <option>Infrastruktur</option>
            </select>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Tanggal</label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
            />
          </div>
        </div>

        <div>
          <ImageUpload
            value={form.foto_url}
            onChange={(url) => setForm({ ...form, foto_url: url })}
            label="Foto"
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <Link
            href="/admin/galeri"
            className="px-6 py-2.5 text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
