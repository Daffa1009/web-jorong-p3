// app/api/forum/komentar/route.js
// POST /api/forum/komentar -> insert komentar baru ke topik tertentu (PUBLIC)

import { supabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

function sanitize(str) {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const topik_id = body.topik_id;
    const nama = sanitize(body.nama);
    const isi = sanitize(body.isi);

    if (!topik_id || !nama || !isi) {
      return Response.json(
        { error: "Topik ID, nama, dan isi komentar wajib diisi" },
        { status: 400 }
      );
    }

    if (nama.length > 100) {
      return Response.json(
        { error: "Nama maksimal 100 karakter" },
        { status: 400 }
      );
    }

    if (isi.length > 2000) {
      return Response.json(
        { error: "Komentar maksimal 2000 karakter" },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured || !supabaseClient) {
      return Response.json(
        { error: "Supabase belum dikonfigurasi. Tidak dapat menambahkan data." },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseClient
      .from("forum_komentar")
      .insert([
        {
          topik_id,
          nama_penulis: nama,
          isi,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath(`/forum/${topik_id}`);
    revalidatePath("/forum");
    return Response.json({ data });
  } catch (error) {
    console.error("Insert komentar error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
