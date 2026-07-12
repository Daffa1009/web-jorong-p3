"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminForumPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/forum")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((d) => setTopics(d.data || []))
      .catch(() => setTopics([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus topik diskusi ini? Semua komentar di dalamnya juga akan terhapus.")) return;
    setDeleting(id);
    try {
      const res = await adminFetch(`/api/admin/forum/${id}`, { method: "DELETE" });
      if (res.ok) {
        load();
      } else {
        alert("Gagal menghapus topik");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-section-title text-section-title font-bold text-on-surface">
            Moderasi Forum Diskusi
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Pantau dan moderasi topik diskusi yang diposting oleh warga
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Memuat...</p>
      ) : topics.length === 0 ? (
        <p className="text-on-surface-variant bg-surface-container-lowest p-lg rounded-lg text-center">
          Belum ada topik diskusi di forum.
        </p>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-label-sm text-label-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Penulis</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Judul Topik</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Kategori</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Komentar</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Tanggal</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low">
                    <td className="px-4 py-3 text-on-surface font-medium">{item.penulis || "Warga Desa"}</td>
                    <td className="px-4 py-3 text-on-surface font-semibold max-w-xs truncate">{item.judul}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.kategori === "Pengumuman"
                          ? "bg-primary-container/20 text-primary-container"
                          : item.kategori === "Aspirasi"
                          ? "bg-secondary-container/20 text-secondary-container"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {item.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant font-medium">
                      {item.jumlahKomentar} komentar
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="px-3 py-1.5 bg-error-container/20 text-on-error-container rounded-lg hover:bg-error-container/30 transition-colors font-label-sm disabled:opacity-60"
                      >
                        {deleting === item.id ? "..." : "Hapus"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
