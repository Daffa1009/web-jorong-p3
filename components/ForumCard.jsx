"use client";

import Link from "next/link";

export default function ForumCard({ thread }) {
  const penulis = thread.penulis || thread.nama_penulis || "Warga Desa";
  const avatar = thread.avatar || thread.avatar_url;
  const jumlahKomentar =
    typeof thread.jumlahKomentar !== "undefined"
      ? thread.jumlahKomentar
      : thread.jumlah_komentar || 0;
  const tanggal =
    thread.tanggal ||
    (thread.created_at
      ? new Date(thread.created_at).toLocaleDateString("id-ID")
      : "");

  // Border left color per kategori
  const borderColor =
    thread.kategori === "Pengumuman"
      ? "#004643"
      : thread.kategori === "Aspirasi"
      ? "#F2A65A"
      : "#4A6572";

  // Badge style per kategori
  const badgeStyle =
    thread.kategori === "Pengumuman"
      ? { backgroundColor: "rgba(0,70,67,0.10)", color: "#004643" }
      : thread.kategori === "Aspirasi"
      ? { backgroundColor: "rgba(242,166,90,0.15)", color: "#D4854A" }
      : { backgroundColor: "rgba(74,101,114,0.10)", color: "#4A6572" };

  return (
    <Link
      href={`/forum/${thread.id}`}
      className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-card border border-border border-l-[4px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-medium cursor-pointer"
      style={{ borderLeftColor: borderColor }}
    >
      {/* Avatar */}
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-border"
          src={avatar}
          alt={penulis}
        />
      ) : (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
          style={{ backgroundColor: borderColor }}
        >
          {penulis.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-1">
          {/* Badge kategori */}
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full w-fit"
            style={badgeStyle}
          >
            {thread.kategori}
          </span>
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
            {thread.judul}
          </h3>
        </div>
        <p className="text-[13px] text-text-secondary truncate leading-relaxed">
          {thread.isi}
        </p>
      </div>

      {/* Meta */}
      <div className="hidden sm:flex flex-col items-end flex-shrink-0 text-text-muted gap-1">
        <span className="text-[11px]">{tanggal}</span>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">forum</span>
          <span className="text-[11px] font-medium">{jumlahKomentar}</span>
        </div>
      </div>
    </Link>
  );
}
