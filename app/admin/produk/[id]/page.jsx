"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { adminFetch } from "@/lib/admin-fetch";

export default function EditProdukPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState({
    nama: "",
    kategori: "Makanan",
    deskripsi: "",
    harga: "",
    pengrajin: "",
    foto_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/produk")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((d) => {
        const item = (d.data || []).find((p) => p.id === id);
        if (item) {
          setForm({
            nama: item.nama || "",
            kategori: item.kategori || "Makanan",
            deskripsi: item.deskripsi || "",
            harga: item.harga || "",
            pengrajin: item.pengrajin || "",
            foto_url: item.foto_url || "",
          });
        } else {
          setError("Produk tidak ditemukan");
        }
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/produk/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/produk");
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
      <Link
        href="/admin/produk"
        className="inline-flex items-center text-primary font-label-sm text-label-sm hover:underline mb-lg"
      >
        <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
        Kembali
      </Link>

      <h1 className="font-section-title text-section-title font-bold text-on-surface mb-lg">
        Edit Produk
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-[900px]">
        <div className="space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Nama Produk</label>
            <input
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
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
              <option>Makanan</option>
              <option>Pertanian</option>
              <option>Kerajinan</option>
            </select>
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Harga</label>
            <input
              value={form.harga}
              onChange={(e) => setForm({ ...form, harga: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
            />
          </div>
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Pengrajin / Sumber</label>
            <input
              value={form.pengrajin}
              onChange={(e) => setForm({ ...form, pengrajin: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
            />
          </div>
        </div>

        <div className="space-y-4">
          <ImageUpload
            value={form.foto_url}
            onChange={(url) => setForm({ ...form, foto_url: url })}
            label="Foto Produk"
          />
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Deskripsi</label>
            <textarea
              rows={4}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md resize-y"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Update"}
          </button>
          <Link
            href="/admin/produk"
            className="px-6 py-2.5 text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
