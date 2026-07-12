// app/forum/[id]/page.jsx
// Halaman detail topik (Server Component)

import Link from "next/link";
import { getForumTopikById } from "@/lib/supabase-queries";
import ForumCommentsSection from "@/components/ForumCommentsSection";

export const revalidate = 0; // Pastikan data selalu segar (SSR)

export default async function DetailDiskusiPage({ params }) {
  const { id } = params;
  const thread = await getForumTopikById(id);

  if (!thread) {
    return (
      <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
        <h1 className="font-section-title text-2xl text-on-surface mb-4 font-bold">Topik tidak ditemukan</h1>
        <p className="text-on-surface-variant mb-6 font-body-md">Topik diskusi yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/forum" className="text-primary font-label-sm text-label-sm hover:underline inline-flex items-center gap-1">
          &larr; Kembali ke Forum
        </Link>
      </div>
    );
  }

  // Set category design badge styling
  let categoryBadgeClass = "bg-blue-100 text-blue-700";
  if (thread.kategori === "Pengumuman") {
    categoryBadgeClass = "bg-primary-container/20 text-primary-container";
  } else if (thread.kategori === "Aspirasi") {
    categoryBadgeClass = "bg-secondary-container/20 text-secondary-container";
  }

  return (
    <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-lg">
      {/* Breadcrumb */}
      <Link
        href="/forum"
        className="inline-flex items-center text-primary font-label-sm text-label-sm hover:underline mb-lg font-medium"
      >
        <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
        Kembali ke Daftar Forum
      </Link>

      {/* Main Post */}
      <article className="bg-surface-container-lowest rounded-lg p-md shadow-[0_1px_3px_rgba(0,0,0,0.1)] mb-md">
        {/* Author + Meta */}
        <div className="flex items-center gap-sm mb-4">
          {thread.avatar ? (
            <img
              className="w-[48px] h-[48px] rounded-full object-cover flex-shrink-0"
              src={thread.avatar}
              alt={thread.penulis}
            />
          ) : (
            <div className="w-[48px] h-[48px] rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold text-lg flex-shrink-0">
              {(thread.penulis || "W").charAt(0)}
            </div>
          )}
          <div>
            <h2 className="font-label-sm text-label-sm font-bold text-on-surface">
              {thread.penulis || "Warga Desa"}
            </h2>
            <p className="text-sm text-on-surface-variant">Penulis Topik</p>
          </div>
          <span
            className={`ml-auto px-3 py-1 rounded font-label-sm text-[12px] font-semibold ${categoryBadgeClass}`}
          >
            {thread.kategori}
          </span>
        </div>

        {/* Content */}
        <h1 className="font-section-title text-[22px] text-on-surface mb-3 font-bold leading-snug">
          {thread.judul}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap break-words">
          {thread.isi}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/50">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-label-sm text-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
              <span>Suka</span>
            </button>
          </div>
          <span className="font-label-sm text-sm text-on-surface-variant">
            {thread.tanggal}
          </span>
        </div>
      </article>

      {/* Comments List & Reply Form */}
      <ForumCommentsSection topicId={thread.id} initialComments={thread.komentar || []} />
    </div>
  );
}
