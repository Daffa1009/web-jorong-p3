"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { adminFetch } from "@/lib/admin-fetch";

export default function TambahGaleriPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    judul: "",
    kategori: "Sosial Kepemudaan",
    tanggal: "",
    foto_url: "", // Kita simpan cover di foto_url & foto_cover
  });

  // State untuk foto tambahan
  const [additionalFiles, setAdditionalFiles] = useState([]); // Array of { id, file, previewUrl }
  const [uploadProgress, setUploadProgress] = useState({ active: false, total: 0, current: 0, percentage: 0 });
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const showToast = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleAdditionalFileChange = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Maksimal 10 foto tambahan
    if (additionalFiles.length + files.length > 10) {
      setError("Maksimal 10 foto tambahan per kegiatan");
      return;
    }

    const newFiles = files.map(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} melebihi 5MB`);
        return null;
      }
      return {
        id: Math.random().toString(36).slice(2, 9),
        file,
        previewUrl: URL.createObjectURL(file)
      };
    }).filter(Boolean);

    setAdditionalFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAdditionalFile = (id, previewUrl) => {
    setAdditionalFiles(prev => prev.filter(f => f.id !== id));
    URL.revokeObjectURL(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.foto_url) {
      setError("Foto cover wajib diunggah");
      return;
    }

    setSaving(true);
    try {
      // 1. Simpan data utama galeri
      const res = await adminFetch("/api/admin/galeri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: form.judul,
          kategori: form.kategori,
          tanggal: form.tanggal,
          foto_cover: form.foto_url,
          foto_url: form.foto_url,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan kegiatan");
        setSaving(false);
        return;
      }

      const { data: newGaleri } = await res.json();
      const galeriId = newGaleri.id;

      // 2. Upload foto tambahan jika ada
      if (additionalFiles.length > 0) {
        setUploadProgress({ active: true, total: additionalFiles.length, current: 0, percentage: 0 });
        const uploadedUrls = [];

        for (let i = 0; i < additionalFiles.length; i++) {
          const item = additionalFiles[i];
          const formData = new FormData();
          formData.append("file", item.file);
          formData.append("folder", `galeri/${galeriId}`);

          try {
            const uploadRes = await adminFetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              uploadedUrls.push(uploadData.publicUrl);
            } else {
              console.error(`Gagal upload file tambahan ke-${i + 1}`);
            }
          } catch (uploadErr) {
            console.error(uploadErr);
          }

          const currentCount = i + 1;
          setUploadProgress(prev => ({
            ...prev,
            current: currentCount,
            percentage: Math.round((currentCount / additionalFiles.length) * 100)
          }));
        }

        // 3. Simpan URL foto tambahan ke tabel galeri_foto
        if (uploadedUrls.length > 0) {
          const saveRes = await adminFetch(`/api/admin/galeri/${galeriId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              foto_tambahan: uploadedUrls
            })
          });

          if (!saveRes.ok) {
            console.error("Gagal menyimpan foto tambahan ke database");
          }
        }
      }

      showToast("Kegiatan dan semua foto berhasil ditambahkan!");
      
      // Delay redirection sedikit agar user bisa melihat snackbar sukses
      setTimeout(() => {
        router.push("/admin/galeri");
      }, 1500);

    } catch (err) {
      setError("Terjadi kesalahan koneksi");
      setSaving(false);
    }
  };

  return (
    <div className="relative">
      <Link
        href="/admin/galeri"
        className="inline-flex items-center text-primary font-label-sm text-label-sm hover:underline mb-lg"
      >
        <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
        Kembali
      </Link>

      <h1 className="font-section-title text-section-title font-bold text-on-surface mb-lg">
        Tambah Galeri Kegiatan
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-[900px]">
        <div className="space-y-4">
          <div>
            <label className="font-label-sm text-label-sm text-on-surface block mb-1">Judul Kegiatan</label>
            <input
              required
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md"
              placeholder="Masukkan judul kegiatan..."
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

          {/* Upload Foto Tambahan */}
          <div className="pt-4 border-t border-outline-variant">
            <label className="font-label-sm text-label-sm text-on-surface block mb-2">
              Foto Tambahan (Maksimal 10 foto)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAdditionalFileChange}
                className="hidden"
                id="multi-upload-input"
                disabled={saving}
              />
              <label
                htmlFor="multi-upload-input"
                className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline rounded-xl font-label-sm text-label-sm cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                Pilih Foto
              </label>
              {additionalFiles.length > 0 && (
                <span className="font-body-md text-sm text-on-surface-variant">
                  {additionalFiles.length} foto terpilih
                </span>
              )}
            </div>

            {/* Preview Grid */}
            {additionalFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3 p-3 bg-surface-container rounded-xl border border-outline-variant">
                {additionalFiles.map((item) => (
                  <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border border-outline group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalFile(item.id, item.previewUrl)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <ImageUpload
            value={form.foto_url}
            onChange={(url) => setForm({ ...form, foto_url: url })}
            label="Foto Cover (Utama)"
          />
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress.active && (
          <div className="md:col-span-2 p-4 bg-surface-container rounded-xl border border-primary/20 space-y-2">
            <div className="flex justify-between font-label-sm text-label-sm text-on-surface">
              <span>Mengunggah foto tambahan...</span>
              <span>{uploadProgress.current} dari {uploadProgress.total} ({uploadProgress.percentage}%)</span>
            </div>
            <div className="w-full bg-outline-variant h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${uploadProgress.percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : "Simpan"}
          </button>
          <Link
            href="/admin/galeri"
            className="px-6 py-2.5 text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>

      {/* Snackbar / Toast Notification */}
      {snackbar.show && (
        <div className="fixed bottom-5 right-5 z-50 bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-slide-in">
          <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
          <span className="font-body-md text-label-md font-semibold">{snackbar.message}</span>
        </div>
      )}
    </div>
  );
}
