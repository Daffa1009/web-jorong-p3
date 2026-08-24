"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { adminFetch } from "@/lib/admin-fetch";

export default function EditGaleriPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    judul: "",
    kategori: "Sosial Kepemudaan",
    tanggal: "",
    foto_url: "", // Simpan cover di foto_url
  });
  
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Upload state untuk foto tambahan baru
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [snackbar, setSnackbar] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchGaleriData = async () => {
    try {
      const res = await adminFetch(`/api/admin/galeri/${id}`);
      if (res.ok) {
        const d = await res.json();
        if (d.data) {
          setForm({
            judul: d.data.judul || "",
            kategori: d.data.kategori || "Sosial Kepemudaan",
            tanggal: d.data.tanggal || "",
            foto_url: d.data.foto_cover || d.data.foto_url || "",
          });
          setExistingPhotos(d.data.fotos || []);
        } else {
          setError("Item tidak ditemukan");
        }
      } else {
        setError("Gagal memuat data");
      }
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGaleriData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/galeri/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: form.judul,
          kategori: form.kategori,
          tanggal: form.tanggal,
          foto_cover: form.foto_url,
          foto_url: form.foto_url,
        }),
      });
      if (res.ok) {
        showToast("Detail kegiatan berhasil diperbarui!");
        setTimeout(() => {
          router.push("/admin/galeri");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan");
        setSaving(false);
      }
    } catch {
      setError("Koneksi gagal");
      setSaving(false);
    }
  };

  // Hapus foto tambahan individual
  const handleDeletePhoto = async (fotoId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus foto ini secara permanen dari galeri kegiatan?")) {
      return;
    }

    try {
      const res = await adminFetch(`/api/admin/galeri-foto/${fotoId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setExistingPhotos(prev => prev.filter(p => p.id !== fotoId));
        showToast("Foto berhasil dihapus!");
      } else {
        showToast("Gagal menghapus foto", "error");
      }
    } catch {
      showToast("Gagal menghapus foto karena masalah koneksi", "error");
    }
  };

  // Tambah foto tambahan baru ke kegiatan existing
  const handleAddNewPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (existingPhotos.length + files.length > 10) {
      alert("Maksimal 10 foto tambahan per kegiatan");
      return;
    }

    setUploadingAdditional(true);
    setUploadProgress({ current: 0, total: files.length });
    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} melebihi 5MB dan akan dilewati`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `galeri/${id}`);

        const uploadRes = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: formData
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedUrls.push(uploadData.publicUrl);
        }
        setUploadProgress(prev => ({ ...prev, current: i + 1 }));
      }

      if (uploadedUrls.length > 0) {
        const updateRes = await adminFetch(`/api/admin/galeri/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foto_tambahan: uploadedUrls
          })
        });

        if (updateRes.ok) {
          showToast("Foto tambahan berhasil ditambahkan!");
          // Re-fetch data terbaru
          fetchGaleriData();
        } else {
          showToast("Gagal menyimpan foto tambahan baru ke DB", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Masalah saat mengunggah foto baru", "error");
    } finally {
      setUploadingAdditional(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (loading) return <p className="text-on-surface-variant font-body-md">Memuat data kegiatan...</p>;

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
        Edit Galeri Kegiatan
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

          {/* Bagian Kelola Foto Existing */}
          <div className="pt-4 border-t border-outline-variant space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-label-sm text-label-sm text-on-surface block">
                Foto Tambahan Kegiatan ({existingPhotos.length} foto)
              </label>
              <div className="flex items-center">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAddNewPhotos}
                  className="hidden"
                  id="add-more-photos-input"
                  disabled={uploadingAdditional || saving}
                />
                <label
                  htmlFor="add-more-photos-input"
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded-xl font-label-sm text-xs cursor-pointer flex items-center gap-1 hover:bg-surface-tint transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Tambah Foto
                </label>
              </div>
            </div>

            {uploadingAdditional && (
              <div className="p-3 bg-surface-container rounded-xl border border-primary/20 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-body-md text-sm text-on-surface-variant">
                  Mengunggah foto baru... ({uploadProgress.current} / {uploadProgress.total})
                </span>
              </div>
            )}

            {existingPhotos.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-outline group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.foto_url}
                      alt="Gallery"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body-md text-sm text-on-surface-variant italic">Belum ada foto tambahan.</p>
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

        <div className="md:col-span-2 flex items-center gap-3">
          {error && <p className="text-error font-label-sm text-label-sm">{error}</p>}
          <button
            type="submit"
            disabled={saving || uploadingAdditional}
            className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-xl shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                Memperbarui...
              </>
            ) : "Update"}
          </button>
          <Link
            href="/admin/galeri"
            className="px-6 py-2.5 text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low rounded-xl transition-colors"
          >
            Batal
          </Link>
        </div>
      </form>

      {/* Toast Notification */}
      {snackbar.show && (
        <div className="fixed bottom-5 right-5 z-50 bg-surface-container-highest border border-primary/20 text-on-surface px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-slide-in">
          <span className="material-symbols-outlined text-primary text-[22px]">check_circle</span>
          <span className="font-body-md text-label-md font-semibold">{snackbar.message}</span>
        </div>
      )}
    </div>
  );
}
