"use client";

export default function GalleryCard({ item, onClick }) {
  const gambar = item.foto_url || item.foto || "";

  return (
    <div className="gallery-card bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm border border-outline-variant/20">
      <div className="h-[180px] overflow-hidden">
        <img
          className="w-full h-full object-cover card-zoom-img"
          src={gambar || "https://picsum.photos/800/600?random=30"}
          alt={`Foto ${item.judul}`}
        />
      </div>
      <div className="p-md flex flex-col gap-2">
        <span className="px-2 py-0.5 text-[11px] rounded-full bg-black/10 text-on-surface font-label-sm">
          {item.kategori}
        </span>
        <h3 className="font-label-sm text-label-sm font-bold text-on-surface line-clamp-2">
          {item.judul}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant text-xs">
          {item.tanggal || "-"}
        </p>
        <button
          onClick={onClick}
          className="mt-2 flex items-center justify-center gap-1 bg-surface hover:bg-surface-variant text-primary font-label-sm px-3 py-1.5 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">zoom_in</span>
          Lihat
        </button>
      </div>
    </div>
  );
}
