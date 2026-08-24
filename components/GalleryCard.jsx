"use client";

export default function GalleryCard({ item, onClick }) {
  const coverFoto = item.foto_cover || item.foto_url || item.foto || "";
  const totalPhotos = 1 + (item.fotos ? item.fotos.length : 0);

  return (
    <div
      onClick={onClick}
      className="gallery-card group bg-white rounded-2xl overflow-hidden shadow-card border border-border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-medium"
    >
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          src={coverFoto || "https://picsum.photos/800/600?random=30"}
          alt={`Foto ${item.judul}`}
        />
        {/* Badge Jumlah Foto */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1 shadow-sm">
          <span>📷</span>
          <span>{totalPhotos} foto</span>
        </div>
        {/* Badge kategori */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white bg-primary/90">
          {item.kategori}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-1.5">
        <h3 className="font-heading font-semibold text-text-primary line-clamp-2 text-sm leading-snug group-hover:text-primary transition-colors">
          {item.judul}
        </h3>
        <div className="flex items-center gap-1 text-text-muted text-[11px] mt-0.5">
          <span className="material-symbols-outlined text-[13px]">calendar_today</span>
          <span>{item.tanggal || "-"}</span>
        </div>
      </div>
    </div>
  );
}
