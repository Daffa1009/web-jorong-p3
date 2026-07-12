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

  // Kategori List
  const kategoriForum = ["Semua", "Pengumuman", "Aspirasi", "Diskusi"];

  // Filter & Search Logic
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

  // Sorting Logic
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

    if (!nama || !judul || !isi) {
      setErrorMsg("Semua field wajib diisi");
      return;
    }
    if (judul.length < 5) {
      setErrorMsg("Judul minimal 5 karakter");
      return;
    }
    if (isi.length < 10) {
      setErrorMsg("Isi topik minimal 10 karakter");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/forum/topik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, judul, isi, kategori }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal membuat topik");
      }

      // Berhasil: Tambahkan topik baru ke state lokal di paling atas
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
      {/* Forum Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg border-b border-outline-variant pb-md">
        <div>
          <h1 className="font-section-title text-section-title text-on-surface mb-2">
            Forum Diskusi Desa
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Wadah komunikasi terbuka untuk seluruh warga desa.
          </p>
        </div>
        <button
          onClick={() => {
            setErrorMsg("");
            setShowNewTopic(true);
          }}
          className="mt-4 md:mt-0 bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:bg-primary-container hover:shadow-md transition-all flex items-center gap-2 font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Buat Topik Baru
        </button>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-md">
          <div className="bg-surface-container-lowest rounded-lg p-md shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-4">
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
                    ? "bg-primary-container"
                    : kat === "Aspirasi"
                    ? "bg-secondary-container"
                    : kat === "Diskusi"
                    ? "bg-blue-600"
                    : "bg-surface-variant";
                return (
                  <li key={kat}>
                    <button
                      onClick={() => setKategoriFilter(kat)}
                      className={`flex items-center justify-between w-full text-left transition-colors ${
                        kategoriFilter === kat
                          ? "text-primary font-semibold"
                          : "text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      <span className="font-body-md text-body-md flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
                        {kat}
                      </span>
                      <span className="bg-surface-container text-primary font-label-sm text-[12px] px-2 py-1 rounded-full font-medium">
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
        <section className="col-span-1 lg:col-span-3 space-y-sm">
          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low p-3 rounded-lg mb-4 gap-4">
            <div className="relative w-full sm:w-auto flex-grow max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface"
                placeholder="Cari topik diskusi..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <select
                className="w-full sm:w-auto border border-outline-variant rounded-lg bg-surface-container-lowest px-4 py-2 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Terbaru</option>
                <option>Terlama</option>
                <option>Paling Banyak Komentar</option>
              </select>
            </div>
          </div>

          {/* Thread Cards */}
          <div className="space-y-3">
            {filtered.map((thread) => (
              <ForumCard key={thread.id} thread={thread} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-xl text-on-surface-variant font-body-md bg-surface-container-lowest rounded-lg p-lg border border-dashed border-outline-variant">
              Tidak ada topik ditemukan.
            </div>
          )}
        </section>
      </div>

      {/* New Topic Modal */}
      {showNewTopic && (
        <div className="fixed inset-0 z-50 animate-fadeIn" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-on-background/40 backdrop-blur-sm"
            onClick={() => {
              if (!submitting) setShowNewTopic(false);
            }}
          ></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative transform overflow-hidden rounded-xl bg-surface-container-lowest text-left shadow-xl w-full max-w-lg">
                <div className="p-md">
                  <h2 className="font-section-title text-section-title text-on-surface mb-md">
                    Buat Topik Baru
                  </h2>
                  <form onSubmit={handleNewTopicSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-error-container/10 border border-error-container/20 text-error text-sm rounded-lg font-medium">
                        {errorMsg}
                      </div>
                    )}
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface block mb-1">
                        Nama Anda (Penulis)
                      </label>
                      <input
                        className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface"
                        value={newTopic.nama}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, nama: e.target.value })
                        }
                        required
                        disabled={submitting}
                        placeholder="Nama asli atau nama pena"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface block mb-1">
                        Judul Topik
                      </label>
                      <input
                        className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface"
                        value={newTopic.judul}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, judul: e.target.value })
                        }
                        required
                        disabled={submitting}
                        placeholder="Minimal 5 karakter"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface block mb-1">
                        Kategori
                      </label>
                      <select
                        className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary font-body-md text-body-md text-on-surface"
                        value={newTopic.kategori}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, kategori: e.target.value })
                        }
                        disabled={submitting}
                      >
                        <option>Diskusi</option>
                        <option>Aspirasi</option>
                        <option>Pengumuman</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface block mb-1">
                        Isi Topik
                      </label>
                      <textarea
                        className="w-full border border-outline-variant rounded-lg px-4 py-2 bg-surface focus:ring-2 focus:ring-primary focus:border-primary font-body-md text-body-md text-on-surface resize-y"
                        rows="5"
                        value={newTopic.isi}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, isi: e.target.value })
                        }
                        required
                        disabled={submitting}
                        placeholder="Tuliskan detail aspirasi atau topik diskusi Anda di sini (minimal 10 karakter)..."
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewTopic(false)}
                        className="px-4 py-2 text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-low rounded-xl transition-colors"
                        disabled={submitting}
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-primary text-on-primary font-label-sm text-label-sm font-medium rounded-xl hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
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
