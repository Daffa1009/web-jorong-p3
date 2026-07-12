// app/api/admin/produk/route.js
// GET  /api/admin/produk  -> list semua produk
// POST /api/admin/produk  -> insert produk baru

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
    .from("produk")
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
    const body = await request.json();
    return Response.json({ data: { id: "dummy-" + Date.now(), ...body, created_at: new Date().toISOString() }, note: "Supabase belum dikonfigurasi — data dummy" });
  }

  try {
    const body = await request.json();
    const { nama, kategori, deskripsi, harga, pengrajin, foto_url } = body;

    if (!nama || !kategori) {
      return Response.json({ error: "Nama dan kategori wajib diisi" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("produk")
      .insert([{ nama, kategori, deskripsi, harga, pengrajin, foto_url }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/produk");
    revalidatePath("/");
    return Response.json({ data });
  } catch (error) {
    console.error("Insert produk error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
