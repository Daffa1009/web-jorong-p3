"use client";

import { useState } from "react";
import ForumCard from "@/components/ForumCard";

export default function ForumPageClient({ initialThreads }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Terbaru");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ nama: "", judul: "", kategori: "Diskusi", isi: "" });
  const [localThreads, setLocalThreads] = useState(initialThreads || []);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const kategoriForum = ["Semua", "Pengumuman", "Aspirasi", "Diskusi"];

  let filtered = [...localThreads];
  if (kategoriFilter !== "Semua") {
    filtered = filtered.filter((t) => t.kategori === kategoriFilter);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.judul.toLowerCase().includes(q) ||
        t.isi.toLowerCase().includes(q) ||
        (t.penulis || t.nama_penulis || "").toLowerCase().includes(q)
    );
  }
  if (sortBy === "Terbaru") {
    filtered.sort((a, b) => new Date(b.created_at || b.tanggal) - new Date(a.created_at || a.tanggal));
  } else if (sortBy === "Terlama") {
    filtered.sort((a, b) => new Date(a.created_at || a.tanggal) - new Date(b.created_at || b.tanggal));
  } else if (sortBy === "Paling Banyak Komentar") {
    filtered.sort((a, b) => {
      const countA = typeof a.jumlahKomentar !== "undefined" ? a.jumlahKomentar : (a.jumlah_komentar || 0);
      const countB = typeof b.jumlahKomentar !== "undefined" ? b.jumlahKomentar : (b.jumlah_komentar || 0);
      return countB - countA;
    });
  }

  const handleNewTopicSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const nama = newTopic.nama.trim();
    const judul = newTopic.judul.trim();
    const isi = newTopic.isi.trim();
    const kategori = newTopic.kategori;
    if (!nama || !judul || !isi) { setErrorMsg("Semua field wajib diisi"); return; }
    if (judul.length < 5) { setErrorMsg("Judul minimal 5 karakter"); return; }
    if (isi.length < 10) { setErrorMsg("Isi topik minimal 10 karakter"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/topik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, judul, isi, kategori }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal membuat topik");
      const createdTopic = {
        ...result.data,
        penulis: result.data.nama_penulis,
        avatar: result.data.avatar_url,
        jumlahKomentar: 0,
        jumlah_komentar: 0,
        tanggal: "Baru saja",
      };
      setLocalThreads([createdTopic, ...localThreads]);
      setNewTopic({ nama: "", judul: "", kategori: "Diskusi", isi: "" });
      setShowNewTopic(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Forum Header ─────────────────────────────────── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="font-heading font-bold text-text-primary text-2xl md:text-3xl mb-2" style={{ letterSpacing: "-0.01em" }}>
            Forum Diskusi Desa
          </h1>
          <p className="text-text-secondary text-base">
            Wadah komunikasi terbuka untuk seluruh warga desa.
          </p>
        </div>
        <button
          onClick={() => { setErrorMsg(""); setShowNewTopic(true); }}
          className="mt-4 md:mt-0 bg-primary text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-soft hover:bg-primary-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Buat Topik Baru
        </button>
      </section>

      {/* ── Content Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-border">
            <h3 className="font-semibold text-text-primary text-sm mb-4">
              Kategori Topik
            </h3>
            <ul className="space-y-3">
              {kategoriForum.map((kat) => {
                const count =
                  kat === "Semua"
                    ? localThreads.length
                    : localThreads.filter((t) => t.kategori === kat).length;
                const dotColor =
                  kat === "Pengumuman"
                    ? "#004643"
                    : kat === "Aspirasi"
                    ? "#F2A65A"
                    : kat === "Diskusi"
                    ? "#4A6572"
                    : "#E2E8EA";
                return (
                  <li key={kat}>
                    <button
                      onClick={() => setKategoriFilter(kat)}
                      className={`flex items-center justify-between w-full text-left text-sm transition-colors ${
                        kategoriFilter === kat
                          ? "text-primary font-semibold"
                          : "text-text-secondary hover:text-primary"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: dotColor }}
                        />
                        {kat}
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "rgba(0,70,67,0.08)", color: "#004643" }}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Thread List */}
        <section className="col-span-1 lg:col-span-3 space-y-4">
          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-3 rounded-xl mb-2 gap-3 border border-border bg-background">
            <div className="relative w-full sm:w-auto flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-white text-sm text-text-primary focus:ring-2 focus:border-primary transition-colors"
                style={{ "--tw-ring-color": "rgba(0,70,67,0.15)" }}
                placeholder="Cari topik diskusi..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="w-full sm:w-auto border border-border rounded-xl bg-white px-4 py-2.5 text-sm text-text-primary focus:ring-2 focus:border-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Terbaru</option>
              <option>Terlama</option>
              <option>Paling Banyak Komentar</option>
            </select>
          </div>

          {/* Thread Cards */}
          <div className="space-y-3">
            {filtered.map((thread) => (
              <ForumCard key={thread.id} thread={thread} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="text-center py-14 text-text-secondary bg-white rounded-2xl border border-dashed border-border"
            >
              <span className="material-symbols-outlined text-[40px] text-text-muted block mb-2">
                forum
              </span>
              Tidak ada topik ditemukan.
            </div>
          )}
        </section>
      </div>

      {/* ── New Topic Modal ───────────────────────────────── */}
      {showNewTopic && (
        <div className="fixed inset-0 z-50 animate-fadeIn" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(13,27,30,0.45)" }}
            onClick={() => { if (!submitting) setShowNewTopic(false); }}
          />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-large w-full max-w-lg border border-border">
                <div className="p-6 md:p-8">
                  <h2 className="font-heading font-bold text-text-primary text-xl mb-6" style={{ letterSpacing: "-0.01em" }}>
                    Buat Topik Baru
                  </h2>
                  <form onSubmit={handleNewTopicSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 rounded-xl text-sm font-medium border" style={{ backgroundColor: "rgba(192,57,43,0.08)", borderColor: "rgba(192,57,43,0.2)", color: "#C0392B" }}>
                        {errorMsg}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Nama Anda (Penulis)
                      </label>
                      <input
                        className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm text-text-primary focus:ring-2 focus:border-primary focus:bg-white transition-colors"
                        value={newTopic.nama}
                        onChange={(e) => setNewTopic({ ...newTopic, nama: e.target.value })}
                        required
                        disabled={submitting}
                        placeholder="Nama asli atau nama pena"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Judul Topik
                      </label>
                      <input
                        className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm text-text-primary focus:ring-2 focus:border-primary focus:bg-white transition-colors"
                        value={newTopic.judul}
                        onChange={(e) => setNewTopic({ ...newTopic, judul: e.target.value })}
                        required
                        disabled={submitting}
                        placeholder="Minimal 5 karakter"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Kategori
                      </label>
                      <select
                        className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm text-text-primary focus:ring-2 focus:border-primary"
                        value={newTopic.kategori}
                        onChange={(e) => setNewTopic({ ...newTopic, kategori: e.target.value })}
                        disabled={submitting}
                      >
                        <option>Diskusi</option>
                        <option>Aspirasi</option>
                        <option>Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Isi Topik
                      </label>
                      <textarea
                        className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm text-text-primary focus:ring-2 focus:border-primary focus:bg-white transition-colors resize-y"
                        rows="5"
                        value={newTopic.isi}
                        onChange={(e) => setNewTopic({ ...newTopic, isi: e.target.value })}
                        required
                        disabled={submitting}
                        placeholder="Tuliskan detail aspirasi atau topik diskusi Anda di sini (minimal 10 karakter)..."
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewTopic(false)}
                        className="px-5 py-2.5 text-text-secondary text-sm font-medium hover:bg-background rounded-xl transition-colors"
                        disabled={submitting}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-soft disabled:opacity-50"
                        disabled={submitting}
                      >
                        {submitting ? "Mengirim..." : "Kirim Topik"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
