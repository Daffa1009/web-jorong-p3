"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminGaleriPage() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/galeri")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((d) => setGaleri(d.data || []))
      .catch(() => setGaleri([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus item galeri ini? Foto akan dihapus dari storage.")) return;
    setDeleting(id);
    try {
      const res = await adminFetch(`/api/admin/galeri/${id}`, { method: "DELETE" });
      if (res.ok) {
        load();
      } else {
        alert("Gagal menghapus");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h1 className="font-section-title text-section-title font-bold text-on-surface">
            Galeri
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kelola foto kegiatan
          </p>
        </div>
        <Link
          href="/admin/galeri/tambah"
          className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-5 py-2.5 rounded-xl flex items-center gap-1 shadow-sm hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah
        </Link>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Memuat...</p>
      ) : galeri.length === 0 ? (
        <p className="text-on-surface-variant bg-surface-container-lowest p-lg rounded-lg text-center">
          Belum ada foto galeri.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {galeri.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden"
            >
              {item.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.foto_url} alt={item.judul} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-surface-variant" />
              )}
              <div className="p-md">
                <h3 className="font-label-sm text-label-sm font-bold text-on-surface mb-1 line-clamp-1">
                  {item.judul}
                </h3>
                <p className="font-label-sm text-xs text-on-surface-variant mb-2">
                  {item.kategori} · {item.tanggal || "-"}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/galeri/${item.id}`}
                    className="flex-1 text-center px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-label-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="px-3 py-1.5 bg-error-container/20 text-on-error-container rounded-lg hover:bg-error-container/30 transition-colors font-label-sm disabled:opacity-60"
                  >
                    {deleting === item.id ? "..." : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
