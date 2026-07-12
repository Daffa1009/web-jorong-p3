// lib/supabase-queries.js
// Server-side fetch dari Supabase. Kalau Supabase belum dikonfigurasi
// atau query error, fallback ke data lokal di /data/*.

import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { produkList as fallbackProduk, kategoriProduk as fallbackKategoriProduk } from "@/data/produk";
import { galeriList as fallbackGaleri, kategoriGaleri as fallbackKategoriGaleri } from "@/data/galeri";
import { desaInfo as fallbackDesaInfo } from "@/data/desa-info";

// ================================================================
// PRODUK
// ================================================================

export async function getProduk() {
  if (!isSupabaseConfigured || !supabaseClient) {
    return fallbackProduk;
  }
  try {
    const { data, error } = await supabaseClient
      .from("produk")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    // Seragamkan field name (db pakai foto_url, komponen pakai foto_url/foto)
    return (data || []).map((item) => ({
      ...item,
      foto: item.foto_url,
    }));
  } catch {
    return fallbackProduk;
  }
}

export async function getKategoriProduk() {
  return fallbackKategoriProduk;
}

// ================================================================
// GALERI
// ================================================================

export async function getGaleri() {
  if (!isSupabaseConfigured || !supabaseClient) {
    return fallbackGaleri;
  }
  try {
    const { data, error } = await supabaseClient
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((item) => ({
      ...item,
      foto: item.foto_url,
    }));
  } catch {
    return fallbackGaleri;
  }
}

export async function getKategoriGaleri() {
  return fallbackKategoriGaleri;
}

// ================================================================
// DESA INFO
// ================================================================

export async function getDesaInfo() {
  if (!isSupabaseConfigured || !supabaseClient) {
    return fallbackDesaInfo;
  }
  try {
    const { data, error } = await supabaseClient
      .from("desa_info")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) throw error;
    // Map dari field db ke field yang dipakai komponen
    return {
      nama: data.nama_desa || fallbackDesaInfo.nama,
      tagline: data.tagline || fallbackDesaInfo.tagline,
      sejarah: (data.sejarah_teks || "").replace(/\n/g, "\n"),
      visi: data.visi || fallbackDesaInfo.visi,
      misi: Array.isArray(data.misi) ? data.misi : fallbackDesaInfo.misi,
      timeline: Array.isArray(data.timeline)
        ? data.timeline.map((t) => ({
            tahun: t.tahun,
            keterangan: t.keterangan,
            deskripsi: t.keterangan, // compat dengan komponen lama (pakai deskripsi)
          }))
        : fallbackDesaInfo.timeline,
      alamat: data.alamat_kantor || fallbackDesaInfo.alamat,
      telepon: data.telepon || fallbackDesaInfo.telepon,
      email: data.email || fallbackDesaInfo.email,
      jamOperasional: data.jam_operasional
        ? {
            seninKamis: data.jam_operasional.senin_jumat || "08:00 - 16:00 WIB",
            jumat: data.jam_operasional.senin_jumat || "08:00 - 16:00 WIB",
            akhirPekan: data.jam_operasional.sabtu_minggu || "Tutup",
          }
        : fallbackDesaInfo.jamOperasional,
      batasWilayah: fallbackDesaInfo.batasWilayah,
      geografis: fallbackDesaInfo.geografis,
      koordinat: fallbackDesaInfo.koordinat,
      sosialMedia: {
        facebook: data.facebook || fallbackDesaInfo.sosialMedia.facebook,
        instagram: data.instagram || fallbackDesaInfo.sosialMedia.instagram,
        whatsapp: data.whatsapp || fallbackDesaInfo.sosialMedia.whatsapp,
        youtube: fallbackDesaInfo.sosialMedia.youtube,
      },
      fotoHeroUrl: data.foto_hero_url || "",
      fotoSejarahUrl: data.foto_sejarah_url || "",
    };
  } catch {
    return fallbackDesaInfo;
  }
}

// ================================================================
// FORUM
// ================================================================

import { forumThreads as fallbackForumThreads } from "@/data/forum";

/**
 * Fetch semua topik forum + jumlah komentar per topik.
 * Order: created_at DESC (terbaru di atas).
 */
export async function getForumTopik() {
  if (!isSupabaseConfigured || !supabaseClient) {
    return fallbackForumThreads.map((t) => ({
      ...t,
      id: String(t.id),
      nama_penulis: t.penulis,
      avatar_url: t.avatar,
      jumlah_komentar: t.jumlahKomentar,
      created_at: t.tanggal,
    }));
  }
  try {
    // Fetch semua topik
    const { data: topikData, error: topikError } = await supabaseClient
      .from("forum_topik")
      .select("*")
      .order("created_at", { ascending: false });
    if (topikError) throw topikError;

    // Fetch jumlah komentar per topik dalam satu query
    if (topikData.length === 0) return [];

    const topikIds = topikData.map((t) => t.id);
    const countMap = {};
    const { data: allKomentar } = await supabaseClient
      .from("forum_komentar")
      .select("topik_id")
      .in("topik_id", topikIds);
    if (allKomentar) {
      allKomentar.forEach((k) => {
        countMap[k.topik_id] = (countMap[k.topik_id] || 0) + 1;
      });
    }

    return topikData.map((t) => ({
      ...t,
      penulis: t.nama_penulis,
      avatar: t.avatar_url,
      jumlahKomentar: countMap[t.id] || 0,
      jumlah_komentar: countMap[t.id] || 0,
      tanggal: formatRelativeTime(t.created_at),
    }));
  } catch {
    return forumThreads.map((t) => ({
      ...t,
      id: String(t.id),
      nama_penulis: t.penulis,
      avatar_url: t.avatar,
      jumlah_komentar: t.jumlahKomentar,
      created_at: t.tanggal,
    }));
  }
}

/**
 * Fetch 1 topik + semua komentarnya.
 * Komentar diurutkan terlama → terbaru.
 */
export async function getForumTopikById(id) {
  if (!isSupabaseConfigured || !supabaseClient) {
    const fallback = forumThreads.find((t) => String(t.id) === String(id));
    if (!fallback) return null;
    return {
      ...fallback,
      id: String(fallback.id),
      nama_penulis: fallback.penulis,
      avatar_url: fallback.avatar,
      created_at: fallback.tanggal,
      komentar: (fallback.komentar || []).map((k) => ({
        ...k,
        id: String(k.id),
        nama_penulis: k.penulis,
        created_at: k.tanggal,
      })),
    };
  }
  try {
    // Fetch topik
    const { data: topik, error: topikError } = await supabaseClient
      .from("forum_topik")
      .select("*")
      .eq("id", id)
      .single();
    if (topikError) return null;

    // Fetch komentar (terlama → terbaru)
    const { data: komentar, error: komentarError } = await supabaseClient
      .from("forum_komentar")
      .select("*")
      .eq("topik_id", id)
      .order("created_at", { ascending: true });

    return {
      ...topik,
      penulis: topik.nama_penulis,
      avatar: topik.avatar_url,
      tanggal: formatRelativeTime(topik.created_at),
      komentar: (komentar || []).map((k) => ({
        ...k,
        penulis: k.nama_penulis,
        avatar: "https://picsum.photos/40/40?random=" + (Math.floor(Math.random() * 50) + 30),
        tanggal: formatRelativeTime(k.created_at),
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Format timestamp → relative string sederhana (pakai locale id).
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
