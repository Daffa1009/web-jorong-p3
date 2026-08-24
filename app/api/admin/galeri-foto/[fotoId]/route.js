// app/api/admin/galeri-foto/[fotoId]/route.js
// DELETE /api/admin/galeri-foto/:fotoId -> hapus foto tambahan individual

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured, extractStoragePath, STORAGE_BUCKET } from "@/lib/supabase";

async function deleteOldPhoto(publicUrl) {
  const path = extractStoragePath(publicUrl);
  if (!path) return;
  try {
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (e) {
    console.error("Gagal hapus foto dari storage:", e);
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    return Response.json({ ok: true, note: "Supabase belum dikonfigurasi — simulasi hapus foto" });
  }

  try {
    const fotoId = params?.fotoId;
    if (!fotoId) {
      return Response.json({ error: "ID foto wajib diisi" }, { status: 400 });
    }

    // 1. Ambil URL foto
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("galeri_foto")
      .select("foto_url")
      .eq("id", fotoId)
      .single();

    if (fetchErr) throw fetchErr;

    // 2. Hapus dari database
    const { error: deleteErr } = await supabaseAdmin
      .from("galeri_foto")
      .delete()
      .eq("id", fotoId);

    if (deleteErr) throw deleteErr;

    // 3. Hapus dari storage
    if (existing?.foto_url) {
      await deleteOldPhoto(existing.foto_url);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Delete galeri foto error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
