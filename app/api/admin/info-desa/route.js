// app/api/admin/info-desa/route.js
// GET /api/admin/info-desa  -> ambil row desa_info id=1
// PUT /api/admin/info-desa  -> update row id=1

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured, extractStoragePath, STORAGE_BUCKET } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    return Response.json({ data: null, note: "Supabase belum dikonfigurasi" });
  }

  const { data, error } = await supabaseAdmin
    .from("desa_info")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ data });
}

export async function PUT(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    // Fallback: dummy success
    const body = await request.json();
    return Response.json({ data: { id: 1, ...body }, note: "Supabase belum dikonfigurasi — data dummy" });
  }

  try {
    const body = await request.json();
    const {
      nama_desa,
      tagline,
      sejarah_teks,
      visi,
      misi,
      alamat_kantor,
      telepon,
      email,
      jam_operasional,
      instagram,
      facebook,
      whatsapp,
      foto_hero_url,
      foto_sejarah_url,
      timeline,
    } = body;

    // Ambil data lama untuk hapus foto yang diganti
    const { data: existing } = await supabaseAdmin
      .from("desa_info")
      .select("foto_hero_url, foto_sejarah_url")
      .eq("id", 1)
      .single();

    const updatePayload = {
      nama_desa,
      tagline,
      sejarah_teks,
      visi,
      misi: misi || null,
      alamat_kantor,
      telepon,
      email,
      jam_operasional: jam_operasional || null,
      instagram,
      facebook,
      whatsapp,
      foto_hero_url,
      foto_sejarah_url,
      timeline: timeline || null,
    };

    const { data, error } = await supabaseAdmin
      .from("desa_info")
      .update(updatePayload)
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;

    // Hapus foto lama dari storage kalau diganti
    const removedPaths = [];
    if (existing && foto_hero_url && existing.foto_hero_url && foto_hero_url !== existing.foto_hero_url) {
      const p = extractStoragePath(existing.foto_hero_url);
      if (p) removedPaths.push(p);
    }
    if (existing && foto_sejarah_url && existing.foto_sejarah_url && foto_sejarah_url !== existing.foto_sejarah_url) {
      const p = extractStoragePath(existing.foto_sejarah_url);
      if (p) removedPaths.push(p);
    }
    if (removedPaths.length > 0) {
      try {
        await supabaseAdmin.storage.from(STORAGE_BUCKET).remove(removedPaths);
      } catch (e) {
        console.error("Gagal hapus foto lama:", e);
      }
    }

    revalidatePath("/profil");
    revalidatePath("/kontak");
    revalidatePath("/");
    revalidatePath("/admin/info-desa");
    return Response.json({ data });
  } catch (error) {
    console.error("Update desa_info error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
