"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForumCommentsSection({ topicId, initialComments }) {
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [nama, setNama] = useState("");
  const [commentText, setCommentText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const nameVal = nama.trim();
    const commentVal = commentText.trim();

    if (!nameVal || !commentVal) {
      setErrorMsg("Nama dan isi komentar wajib diisi");
      return;
    }

    if (commentVal.length > 2000) {
      setErrorMsg("Komentar maksimal 2000 karakter");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/forum/komentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topik_id: topicId,
          nama: nameVal,
          isi: commentVal,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengirim komentar");
      }

      setNama("");
      setCommentText("");
      setShowReplyForm(false);
      
      // Refresh the page server-side to pull the new comment
      router.refresh();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-label-sm text-label-sm font-bold text-on-surface">
          {initialComments.length} Balasan
        </h3>
        <button
          onClick={() => {
            setErrorMsg("");
            setShowReplyForm(!showReplyForm);
          }}
          className="flex items-center gap-1.5 text-primary hover:text-primary-container font-label-sm text-sm font-semibold transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          Tulis Balasan
        </button>
      </div>

      {/* Reply Form (togglable) */}
      {showReplyForm && (
        <div className="mb-md animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-lg p-md">
            <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-3">
              Tulis Balasan
            </h3>
            {errorMsg && (
              <div className="mb-3 p-3 bg-error-container/10 border border-error-container/20 text-error text-sm rounded-lg font-medium">
                {errorMsg}
              </div>
            )}
            <div className="mb-3">
              <label className="font-label-sm text-[12px] text-on-surface block mb-1">
                Nama Anda
              </label>
              <input
                className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Anda"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className="font-label-sm text-[12px] text-on-surface block mb-1">
                Komentar
              </label>
              <textarea
                className="w-full border border-outline-variant rounded-lg px-4 py-3 bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface resize-y"
                rows="4"
                placeholder="Tulis balasan Anda..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                disabled={submitting}
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 text-on-surface-variant font-label-sm text-sm hover:bg-surface-variant rounded-xl transition-colors"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-on-primary font-label-sm text-sm font-medium rounded-xl hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Mengirim..." : "Kirim Balasan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {initialComments.map((komentar) => (
          <div
            key={komentar.id}
            className="bg-surface-container-lowest rounded-lg p-4 flex items-start gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          >
            {komentar.avatar ? (
              <img
                className="w-[40px] h-[40px] rounded-full object-cover flex-shrink-0"
                src={komentar.avatar}
                alt={komentar.penulis}
              />
            ) : (
              <div className="w-[40px] h-[40px] rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold text-sm flex-shrink-0">
                {(komentar.penulis || "W").charAt(0)}
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-sm text-sm font-bold text-on-surface">
                  {komentar.penulis}
                </span>
                <span className="font-label-sm text-[12px] text-on-surface-variant">
                  {komentar.tanggal}
                </span>
              </div>
              <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed break-words whitespace-pre-wrap">
                {komentar.isi}
              </p>
            </div>
          </div>
        ))}
        {initialComments.length === 0 && (
          <div className="text-center py-lg text-on-surface-variant font-body-md bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant">
            Belum ada balasan. Jadilah yang pertama membalas topik ini!
          </div>
        )}
      </div>
    </section>
  );
}
