"use client";

export default function ProductCard({ produk, onDetailClick }) {
  const gambar = produk.foto_url || produk.foto || "";

  return (
    <div className="product-card group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
      <div className="h-[200px] overflow-hidden">
        <img
          className="w-full h-full object-cover card-zoom-img"
          src={gambar || "https://picsum.photos/600/400?random=23"}
          alt={`Foto ${produk.nama}`}
        />
      </div>
      <div className="p-md flex flex-col gap-2">
        <span className="px-3 py-1 w-max rounded-full font-label-sm font-semibold text-[12px] bg-primary-container/10 text-primary badge-pulse">
          {produk.kategori}
        </span>
        <h3 className="font-label-sm text-label-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {produk.nama}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 flex-grow">
          {produk.deskripsi}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <p className="font-label-sm text-label-sm font-bold text-primary">
            {produk.harga}
          </p>
          <button
            onClick={onDetailClick}
            className="flex items-center gap-2 bg-surface hover:bg-surface-variant text-primary font-label-sm px-3 py-1.5 rounded-lg transition-colors duration-200"
          >
            Detail{" "}
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        </div>
      </div>
    </div>
  );
}
