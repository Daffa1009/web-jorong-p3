"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const LONG_EDGE = 1600; // resolusi output maksimum (sisi panjang)

export default function ImageUpload({ value, onChange, label = "Foto", aspect = "aspect-[4/3]" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || "");

  // ===== State cropper =====
  const [cropOpen, setCropOpen] = useState(false);
  const [srcImage, setSrcImage] = useState(null); // HTMLImageElement hasil load
  const [srcUrl, setSrcUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const stageRef = useRef(null);

  // Rasio target dari prop aspect, mis. "aspect-[16/9]"
  const match = /aspect-\[(\d+)\s*\/\s*(\d+)\]/.exec(aspect || "");
  const ratioW = match ? parseInt(match[1], 10) : 4;
  const ratioH = match ? parseInt(match[2], 10) : 3;
  const ratio = ratioW / ratioH;

  // Ukuran stage cropper di layar (px)
  const stageW = 420;
  const stageH = Math.round(stageW / ratio);

  // Rekomendasi resolusi untuk helper text
  const recLong = LONG_EDGE;
  const recShort = Math.round(LONG_EDGE / ratio);
  const recText =
    ratio >= 1 ? `${recLong}×${recShort}px` : `${recShort}×${recLong}px`;

  // Sinkronkan preview bila value berubah dari luar
  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  // Wheel zoom tanpa scroll halaman (butuh listener non-passive)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !cropOpen) return;
    const handler = (e) => {
      e.preventDefault();
      setZoom((z) => Math.min(3, Math.max(1, z - e.deltaY * 0.0015)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [cropOpen]);

  /** Dimensi efektif gambar setelah rotasi */
  const effectiveDims = useCallback(
    (img) => {
      const swap = rotation % 180 !== 0;
      const nw = swap ? img.naturalHeight : img.naturalWidth;
      const nh = swap ? img.naturalWidth : img.naturalHeight;
      return { nw, nh };
    },
    [rotation]
  );

  /** Scale minimum agar gambar menutupi stage (cover) */
  const minCoverScale = useCallback(
    (img) => {
      const { nw, nh } = effectiveDims(img);
      return Math.max(stageW / nw, stageH / nh);
    },
    [effectiveDims, stageW, stageH]
  );

  /** Batasi pan agar tidak ada celah kosong */
  const clampPan = useCallback(
    (img, z, p) => {
      const { nw, nh } = effectiveDims(img);
      const s = minCoverScale(img) * z;
      const maxX = Math.max(0, (nw * s - stageW) / 2);
      const maxY = Math.max(0, (nh * s - stageH) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, p.x)),
        y: Math.min(maxY, Math.max(-maxY, p.y)),
      };
    },
    [effectiveDims, minCoverScale, stageW, stageH]
  );

  // Terapkan clamp tiap zoom/rotasi berubah
  useEffect(() => {
    if (!srcImage) return;
    setPan((p) => clampPan(srcImage, zoom, p));
  }, [zoom, rotation, srcImage, clampPan]);

  const resetAdjust = () => {
    setZoom(1);
    setRotation(0);
    if (srcImage) setPan({ x: 0, y: 0 });
  };

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

    // Buka mode crop dulu — upload terjadi setelah user klik "Terapkan"
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setSrcImage(img);
      setSrcUrl(url);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setCropOpen(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Gagal membaca gambar");
    };
    img.src = url;
  };

  /** Potong gambar sesuai frame dan hasilkan Blob siap upload */
  const produceBlob = () => {
    const img = srcImage;
    if (!img) return Promise.resolve(null);

    // Skala tampilan saat ini (di ruang stage)
    const s = minCoverScale(img) * zoom;

    // Ukuran output mengikuti rasio, sisi panjang = LONG_EDGE
    let outW, outH;
    if (ratio >= 1) {
      outW = LONG_EDGE;
      outH = Math.round(LONG_EDGE / ratio);
    } else {
      outH = LONG_EDGE;
      outW = Math.round(LONG_EDGE * ratio);
    }

    // Pemetaan stage -> output
    const k = outW / stageW;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    const rad = (rotation * Math.PI) / 180;
    const { naturalWidth: nwRaw, naturalHeight: nhRaw } = img;

    ctx.save();
    ctx.translate(outW / 2 + pan.x * k, outH / 2 + pan.y * k);
    ctx.rotate(rad);
    ctx.scale(s * k, s * k);
    ctx.drawImage(img, -nwRaw / 2, -nhRaw / 2, nwRaw, nhRaw);
    ctx.restore();

    return new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.88)
    );
  };

  const applyAndUpload = async () => {
    setError("");
    const blob = await produceBlob();
    if (!blob) {
      setError("Gagal memproses gambar");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "foto.jpg");

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
      closeCropper();
    } catch {
      setError("Koneksi gagal saat upload");
    } finally {
      setUploading(false);
    }
  };

  const closeCropper = () => {
    setCropOpen(false);
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setSrcUrl("");
    setSrcImage(null);
  };

  // ===== Interaksi geser (mouse & sentuh) =====
  const startDrag = (clientX, clientY) => {
    dragRef.current = { startX: clientX, startY: clientY, baseX: pan.x, baseY: pan.y };
  };
  const moveDrag = (clientX, clientY) => {
    if (!dragRef.current || !srcImage) return;
    const d = dragRef.current;
    setPan(
      clampPan(srcImage, zoom, {
        x: d.baseX + (clientX - d.startX),
        y: d.baseY + (clientY - d.startY),
      })
    );
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div>
      <label className="font-label-sm text-label-sm text-on-surface block mb-2">
        {label}
      </label>

      {/* Preview hasil */}
      <div className={`relative ${aspect} w-full rounded-lg overflow-hidden border border-outline-variant bg-surface-container mb-2 group`}>
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview("");
                onChange("");
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error"
              title="Hapus foto"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px]">image</span>
            <p className="font-label-sm text-label-sm">Belum ada foto</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-on-background/40 flex items-center justify-center">
            <div className="w-8 h-8 border-[3px] border-on-primary border-t-transparent rounded-full animate-spin"></div>
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
          hover:file:bg-primary/85 cursor-pointer"
      />
      <p className="font-label-sm text-xs text-on-surface-variant mt-1">
        Maks 5MB · jpg/png/webp · bisa atur posisi &amp; zoom sebelum unggah ·
        rasio tampilan {ratioW}:{ratioH} (disarankan {recText})
      </p>
      {error && (
        <p className="font-label-sm text-label-sm text-error mt-1">{error}</p>
      )}

      {/* ===== Modal Cropper ===== */}
      {cropOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-card border border-border w-full max-w-[520px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="font-heading font-bold text-on-surface text-base">
                Atur Foto
              </h3>
              <button
                type="button"
                onClick={closeCropper}
                className="p-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant"
                title="Batal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Stage */}
              <div
                ref={stageRef}
                className="relative mx-auto rounded-xl overflow-hidden bg-[repeating-conic-gradient(#e2e8ea_0%_25%,#ffffff_0%_50%)] bg-[length:24px_24px] shadow-inner cursor-grab active:cursor-grabbing select-none"
                style={{ width: stageW, height: stageH, maxWidth: "100%", touchAction: "none" }}
                onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={(e) => {
                  const t = e.touches[0];
                  startDrag(t.clientX, t.clientY);
                }}
                onTouchMove={(e) => {
                  const t = e.touches[0];
                  moveDrag(t.clientX, t.clientY);
                }}
                onTouchEnd={endDrag}
              >
                {srcImage && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={srcUrl}
                    alt="Sumber"
                    draggable={false}
                    className="absolute left-1/2 top-1/2 max-w-none pointer-events-none"
                    style={{
                      transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${minCoverScale(srcImage) * zoom})`,
                      transformOrigin: "center",
                    }}
                  />
                )}
                {/* Panduan rule-of-thirds */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/35"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/35"></div>
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/35"></div>
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/35"></div>
                </div>
              </div>

              {/* Kontrol */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">zoom_out</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#004643]"
                />
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">zoom_in</span>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetAdjust}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 270) % 360)}
                    className="p-2 rounded-lg border border-border text-on-surface-variant hover:bg-surface-container-low"
                    title="Putar ke kiri"
                  >
                    <span className="material-symbols-outlined text-[20px]">rotate_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-2 rounded-lg border border-border text-on-surface-variant hover:bg-surface-container-low"
                    title="Putar ke kanan"
                  >
                    <span className="material-symbols-outlined text-[20px]">rotate_right</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                Geser foto untuk memposisikan · gulir / gunakan slider untuk zoom ·
                foto otomatis dipotong ke rasio <b>{ratioW}:{ratioH}</b> sesuai tampilan web.
              </p>

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}

              <button
                type="button"
                onClick={applyAndUpload}
                disabled={uploading}
                className="gradient-primary-button w-full text-on-primary font-label-sm text-label-sm py-2.5 rounded-xl disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Terapkan &amp; Unggah
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
