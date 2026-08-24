// app/api/admin/galeri/[id]/route.js
// PUT    /api/admin/galeri/:id  -> update galeri (+ swap foto)
// DELETE /api/admin/galeri/:id  -> hapus galeri + hapus foto

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured, extractStoragePath, STORAGE_BUCKET } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function deleteOldPhoto(publicUrl) {
  const path = extractStoragePath(publicUrl);
  if (!path) return;
  try {
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (e) {
    console.error("Gagal hapus foto lama:", e);
  }
}

export async function GET(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    return Response.json({ data: null, note: "Supabase belum dikonfigurasi" });
  }

  try {
    const id = params?.id;
    if (!id) {
      return Response.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // Get galeri
    const { data: galeri, error: galeriErr } = await supabaseAdmin
      .from("galeri")
      .select("*")
      .eq("id", id)
      .single();

    if (galeriErr) throw galeriErr;

    // Get galeri_foto
    const { data: fotos, error: fotosErr } = await supabaseAdmin
      .from("galeri_foto")
      .select("*")
      .eq("galeri_id", id)
      .order("urutan", { ascending: true });

    if (fotosErr) throw fotosErr;

    return Response.json({ data: { ...galeri, fotos: fotos || [] } });
  } catch (error) {
    console.error("Fetch galeri detail error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    const id = params?.id;
    const body = await request.json();
    return Response.json({ data: { id, ...body, updated_at: new Date().toISOString() }, note: "Supabase belum dikonfigurasi — data dummy" });
  }

  try {
    const id = params?.id;
    const body = await request.json();
    const { judul, kategori, tanggal, foto_cover, foto_url, foto_tambahan } = body;

    if (!id) {
      return Response.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // Ambil data cover lama untuk pembersihan jika diubah
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("galeri")
      .select("foto_cover, foto_url")
      .eq("id", id)
      .single();
    if (fetchErr) throw fetchErr;

    const oldFotoCover = existing?.foto_cover || existing?.foto_url;
    const newFotoCover = foto_cover || foto_url;
    const isReplacingCover = newFotoCover && oldFotoCover && newFotoCover !== oldFotoCover;

    // Update main galeri secara dinamis
    const updatePayload = {};
    if (judul !== undefined) updatePayload.judul = judul;
    if (kategori !== undefined) updatePayload.kategori = kategori;
    if (tanggal !== undefined) updatePayload.tanggal = tanggal;
    if (newFotoCover !== undefined) {
      updatePayload.foto_cover = newFotoCover;
      updatePayload.foto_url = newFotoCover;
    }

    let data = existing;
    if (Object.keys(updatePayload).length > 0) {
      const { data: updatedData, error } = await supabaseAdmin
        .from("galeri")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      data = updatedData;
    }

    // Jika ada foto tambahan baru yang dikirim dalam request ini
    if (Array.isArray(foto_tambahan) && foto_tambahan.length > 0) {
      // Ambil urutan terakhir
      const { data: lastFoto } = await supabaseAdmin
        .from("galeri_foto")
        .select("urutan")
        .eq("galeri_id", id)
        .order("urutan", { ascending: false })
        .limit(1);
      
      let baseUrutan = lastFoto && lastFoto[0] ? lastFoto[0].urutan + 1 : 0;
      
      const insertRows = foto_tambahan.map((url, index) => ({
        galeri_id: id,
        foto_url: url,
        urutan: baseUrutan + index
      }));

      const { error: insertErr } = await supabaseAdmin
        .from("galeri_foto")
        .insert(insertRows);
      
      if (insertErr) throw insertErr;
    }

    if (isReplacingCover) {
      await deleteOldPhoto(oldFotoCover);
    }

    revalidatePath("/galeri");
    revalidatePath("/");
    revalidatePath(`/admin/galeri/${id}`);
    return Response.json({ data });
  } catch (error) {
    console.error("Update galeri error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdminSupabaseConfigured) {
    return Response.json({ ok: true, note: "Supabase belum dikonfigurasi — simulasi hapus" });
  }

  try {
    const id = params?.id;
    if (!id) {
      return Response.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // 1. Dapatkan foto cover
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("galeri")
      .select("foto_cover, foto_url")
      .eq("id", id)
      .single();
    if (fetchErr && fetchErr.code !== "PGRST116") throw fetchErr;

    // 2. Dapatkan semua foto tambahan untuk didelete dari storage
    const { data: additionalFotos } = await supabaseAdmin
      .from("galeri_foto")
      .select("foto_url")
      .eq("galeri_id", id);

    // 3. Delete galeri (cascade deletes galeri_foto rows)
    const { error } = await supabaseAdmin.from("galeri").delete().eq("id", id);
    if (error) throw error;

    // 4. Bersihkan file cover dari storage
    const coverUrl = existing?.foto_cover || existing?.foto_url;
    if (coverUrl) {
      await deleteOldPhoto(coverUrl);
    }

    // 5. Bersihkan semua foto tambahan dari storage
    if (additionalFotos && additionalFotos.length > 0) {
      for (const item of additionalFotos) {
        await deleteOldPhoto(item.foto_url);
      }
    }

    revalidatePath("/galeri");
    revalidatePath("/");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Delete galeri error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
