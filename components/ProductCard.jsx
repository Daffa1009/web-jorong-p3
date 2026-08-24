"use client";

export default function ProductCard({ produk, onDetailClick }) {
  const gambar = produk.foto_url || produk.foto || "";

  return (
    <div className="product-card group bg-white rounded-2xl overflow-hidden shadow-card border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-medium">
      {/* Foto */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.07]"
          src={gambar || "https://picsum.photos/600/400?random=23"}
          alt={`Foto ${produk.nama}`}
        />
        {/* Badge kategori — absolute top-left */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-primary shadow-sm">
          {produk.kategori}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2.5">
        <h3 className="font-heading font-semibold text-text-primary group-hover:text-primary transition-colors text-base line-clamp-1">
          {produk.nama}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed" style={{ minHeight: "2.5rem" }}>
          {produk.deskripsi}
        </p>

        {/* Footer card */}
        <div className="mt-1 flex items-center justify-between">
          <p className="font-bold text-primary text-base">
            {produk.harga}
          </p>

          {/* Tombol Detail — slide overlay dari kiri */}
          <button
            onClick={onDetailClick}
            className="relative overflow-hidden border border-primary/20 text-primary px-4 py-2 rounded-xl transition-colors duration-300 group/btn text-xs font-semibold"
            style={{ backgroundColor: "rgba(0,70,67,0.07)" }}
          >
            <span
              className="absolute inset-0 bg-primary transform -translate-x-full transition-transform duration-300 ease-out group-hover/btn:translate-x-0"
            />
            <span className="relative z-10 text-primary group-hover/btn:text-white transition-colors duration-300 flex items-center gap-1.5">
              Detail
              <span className="material-symbols-outlined text-[15px]">visibility</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
