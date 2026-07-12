// app/api/admin/produk/[id]/route.js
// PUT    /api/admin/produk/:id  -> update produk (+ swap foto, hapus foto lama)
// DELETE /api/admin/produk/:id  -> hapus produk + hapus foto dari Storage

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured, extractStoragePath, STORAGE_BUCKET } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function deleteOldPhoto(publicUrl) {
  const path = extractStoragePath(publicUrl);
  if (!path) return;
  try {
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
  } catch (e) {
    // log saja, jangan gagalkan operasi utama
    console.error("Gagal hapus foto lama:", e);
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
    const { nama, kategori, deskripsi, harga, pengrajin, foto_url } = body;

    if (!id) {
      return Response.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // Ambil produk lama untuk cek apakah foto diganti
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("produk")
      .select("foto_url")
      .eq("id", id)
      .single();
    if (fetchErr) throw fetchErr;

    const oldFotoUrl = existing?.foto_url;
    const isReplacingFoto =
      foto_url && oldFotoUrl && foto_url !== oldFotoUrl;

    const { data, error } = await supabaseAdmin
      .from("produk")
      .update({
        nama,
        kategori,
        deskripsi,
        harga,
        pengrajin,
        foto_url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Hapus foto lama kalau diganti
    if (isReplacingFoto) {
      await deleteOldPhoto(oldFotoUrl);
    }

    revalidatePath("/produk");
    revalidatePath("/")
    revalidatePath(`/admin/produk/${id}`);
    return Response.json({ data });
  } catch (error) {
    console.error("Update produk error:", error);
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

    // Ambil foto_url dulu sebelum hapus
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("produk")
      .select("foto_url")
      .eq("id", id)
      .single();
    if (fetchErr && fetchErr.code !== "PGRST116") throw fetchErr;

    const { error } = await supabaseAdmin.from("produk").delete().eq("id", id);
    if (error) throw error;

    // Hapus foto dari storage
    if (existing?.foto_url) {
      await deleteOldPhoto(existing.foto_url);
    }

    revalidatePath("/produk");
    revalidatePath("/");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Delete produk error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
