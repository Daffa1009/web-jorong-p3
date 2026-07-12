"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ value, onChange, label = "Foto", aspect = "aspect-[4/3]" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || "");

  const handleFile = async (file) => {
    setError("");
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Hanya jpg/png/webp yang diizinkan");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Ukuran file melebihi 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload gagal");
        return;
      }

      const data = await res.json();
      setPreview(data.publicUrl);
      onChange(data.publicUrl);
    } catch {
      setError("Koneksi gagal saat upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface block mb-2">
        {label}
      </label>
      <div className={`relative ${aspect} w-full rounded-lg overflow-hidden border border-outline-variant bg-surface-container mb-2`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px]">image</span>
            <p className="font-label-sm text-label-sm">Belum ada foto</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-on-background/40 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-on-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={uploading}
        className="block w-full font-label-sm text-label-sm text-on-surface-variant
          file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
          file:font-label-sm file:label-sm file:bg-primary file:text-on-primary
          hover:file:bg-surface-tint cursor-pointer"
      />
      <p className="font-label-sm text-xs text-on-surface-variant mt-1">
        Maks 5MB · jpg/png/webp
      </p>
      {error && (
        <p className="font-label-sm text-label-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
}
