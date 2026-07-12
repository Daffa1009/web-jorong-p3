"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminProdukPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch("/api/admin/produk")
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((d) => setProduk(d.data || []))
      .catch(() => setProduk([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini? Foto juga akan dihapus dari storage.")) return;
    setDeleting(id);
    try {
      const res = await adminFetch(`/api/admin/produk/${id}`, { method: "DELETE" });
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
            Produk
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kelola produk unggulan
          </p>
        </div>
        <Link
          href="/admin/produk/tambah"
          className="gradient-primary-button text-on-primary font-label-sm text-label-sm px-5 py-2.5 rounded-xl flex items-center gap-1 shadow-sm hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Tambah
        </Link>
      </div>

      {loading ? (
        <p className="text-on-surface-variant">Memuat...</p>
      ) : produk.length === 0 ? (
        <p className="text-on-surface-variant bg-surface-container-lowest p-lg rounded-lg text-center">
          Belum ada produk.
        </p>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-label-sm text-label-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Foto</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Nama</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Kategori</th>
                  <th className="text-left px-4 py-3 font-bold text-on-surface">Harga</th>
                  <th className="text-right px-4 py-3 font-bold text-on-surface">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low">
                    <td className="px-4 py-3">
                      {item.foto_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.foto_url} alt={item.nama} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-surface-variant" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-on-surface font-medium">{item.nama}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{item.kategori}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{item.harga}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/produk/${item.id}`}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-label-sm"
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
