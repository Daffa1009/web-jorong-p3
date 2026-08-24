// app/api/admin/galeri/route.js
// GET  /api/admin/galeri  -> list galeri
// POST /api/admin/galeri  -> insert galeri baru

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    return Response.json({ data: [], note: "Supabase belum dikonfigurasi" });
  }

  const { data, error } = await supabaseAdmin
    .from("galeri")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ data });
}

export async function POST(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    // Fallback dummy success (Supabase belum dikonfigurasi)
    const body = await request.json();
    return Response.json({ data: { id: "dummy-" + Date.now(), ...body, created_at: new Date().toISOString() }, note: "Supabase belum dikonfigurasi — data dummy" });
  }

  try {
    const body = await request.json();
    const { judul, kategori, tanggal, foto_cover, foto_url, foto_tambahan } = body;

    if (!judul || !kategori) {
      return Response.json({ error: "Judul dan kategori wajib diisi" }, { status: 400 });
    }

    const primaryFoto = foto_cover || foto_url;

    const { data, error } = await supabaseAdmin
      .from("galeri")
      .insert([{ judul, kategori, tanggal, foto_cover: primaryFoto, foto_url: primaryFoto }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Insert additional photos if present
    if (Array.isArray(foto_tambahan) && foto_tambahan.length > 0 && data?.id) {
      const insertRows = foto_tambahan.map((url, index) => ({
        galeri_id: data.id,
        foto_url: url,
        urutan: index
      }));

      const { error: insertErr } = await supabaseAdmin
        .from("galeri_foto")
        .insert(insertRows);

      if (insertErr) {
        console.error("Gagal insert galeri_foto:", insertErr);
        // We won't crash the request if additional photos fail, but we'll log it
      }
    }

    revalidatePath("/galeri");
    revalidatePath("/");
    return Response.json({ data });
  } catch (error) {
    console.error("Insert galeri error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
