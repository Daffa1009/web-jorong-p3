// app/api/forum/topik/route.js
// GET  /api/forum/topik  -> list semua topik dengan jumlah komentar
// POST /api/forum/topik  -> insert topik baru (PUBLIC)

import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { getForumTopik } from "@/lib/supabase-queries";
import { revalidatePath } from "next/cache";

// Helper sanitasi input HTML sederhana
function sanitize(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  const topics = await getForumTopik();
  return Response.json({ data: topics });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nama = sanitize(body.nama);
    const kategori = sanitize(body.kategori) || "Diskusi";
    const judul = sanitize(body.judul);
    const isi = sanitize(body.isi);

    // Validasi field wajib
    if (!nama || !judul || !isi) {
      return Response.json(
        { error: "Nama, judul, dan isi topik wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi panjang karakter
    if (judul.length < 5) {
      return Response.json(
        { error: "Judul minimal 5 karakter" },
        { status: 400 }
      );
    }
    if (judul.length > 200) {
      return Response.json(
        { error: "Judul maksimal 200 karakter" },
        { status: 400 }
      );
    }
    if (isi.length < 10) {
      return Response.json(
        { error: "Isi topik minimal 10 karakter" },
        { status: 400 }
      );
    }
    if (isi.length > 2000) {
      return Response.json(
        { error: "Isi topik maksimal 2000 karakter" },
        { status: 400 }
      );
    }
    if (nama.length > 100) {
      return Response.json(
        { error: "Nama maksimal 100 karakter" },
        { status: 400 }
      );
    }

    // Cek konfigurasi Supabase
    if (!isSupabaseConfigured || !supabaseClient) {
      return Response.json(
        { error: "Supabase belum dikonfigurasi. Tidak dapat menambahkan data." },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseClient
      .from("forum_topik")
      .insert([
        {
          nama_penulis: nama,
          kategori,
          judul,
          isi,
          avatar_url: `https://picsum.photos/48/48?random=${Math.floor(
            Math.random() * 50
          )}`,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/forum");
    return Response.json({ data });
  } catch (error) {
    console.error("Insert topik error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
