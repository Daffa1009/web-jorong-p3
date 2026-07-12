"use client";

import Link from "next/link";

export default function ForumCard({ thread }) {
  // Mapping field database vs data fallback
  const penulis = thread.penulis || thread.nama_penulis || "Warga Desa";
  const avatar = thread.avatar || thread.avatar_url;
  const jumlahKomentar = typeof thread.jumlahKomentar !== "undefined" ? thread.jumlahKomentar : (thread.jumlah_komentar || 0);
  const tanggal = thread.tanggal || (thread.created_at ? new Date(thread.created_at).toLocaleDateString("id-ID") : "");

  let borderColorClass = "border-blue-500";
  if (thread.kategori === "Pengumuman") {
    borderColorClass = "border-primary";
  } else if (thread.kategori === "Aspirasi") {
    borderColorClass = "border-secondary-container";
  }

  return (
    <Link
      href={`/forum/${thread.id}`}
      className={`bg-surface-container-lowest rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4 border-l-4 ${borderColorClass}`}
    >
      {/* Avatar */}
      {avatar ? (
        <img
          className="w-[30px] h-[30px] rounded-full object-cover flex-shrink-0"
          src={avatar}
          alt={penulis}
        />
      ) : (
        <div className="w-[30px] h-[30px] rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold text-sm flex-shrink-0">
          {penulis.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <span
            className={`font-label-sm text-[12px] px-2 py-0.5 rounded-[4px] whitespace-nowrap self-start sm:self-auto ${
              thread.kategori === "Pengumuman"
                ? "bg-primary-container/20 text-primary-container"
                : thread.kategori === "Aspirasi"
                ? "bg-secondary-container/20 text-secondary-container"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {thread.kategori}
          </span>
          <h3 className="font-label-sm text-label-sm font-bold text-on-surface truncate hover:text-primary transition-colors">
            {thread.judul}
          </h3>
        </div>
        <p className="font-body-md text-[14px] text-on-surface-variant truncate">
          {thread.isi}
        </p>
      </div>

      {/* Meta */}
      <div className="hidden sm:flex flex-col items-end flex-shrink-0 text-on-surface-variant">
        <span className="font-label-sm text-[12px]">{tanggal}</span>
        <div className="flex items-center gap-1 mt-1">
          <span className="material-symbols-outlined text-[16px]">forum</span>
          <span className="font-label-sm text-[12px]">{jumlahKomentar}</span>
        </div>
      </div>
    </Link>
  );
}
