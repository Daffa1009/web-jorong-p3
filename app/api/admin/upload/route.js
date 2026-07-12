// app/api/admin/upload/route.js
// POST /api/admin/upload — upload foto ke Supabase Storage bucket "desa-images"
// Body: multipart/form-data dengan field "file"
// Validasi: jpg/png/webp, max 5MB
// Return: { publicUrl }

import { requireAdmin, SESSION_COOKIE } from "@/lib/auth";
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXT_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request) {
  // Cek auth
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    // Fallback: Supabase belum dikonfigurasi, return dummy URL
    const random = Math.random().toString(36).slice(2, 10);
    const dummyUrl = `https://picsum.photos/800/600?random=${random}`;
    return Response.json({ publicUrl: dummyUrl, path: `dummy/${random}`, note: "Supabase belum dikonfigurasi — URL dummy" });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return Response.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validasi tipe
    const type = file.type;
    if (!ALLOWED_TYPES.includes(type)) {
      return Response.json({ error: "Tipe file tidak diizinkan (hanya jpg/png/webp)" }, { status: 400 });
    }

    // Validasi ukuran
    const size = file.size;
    if (size > MAX_SIZE) {
      return Response.json({ error: "Ukuran file melebihi 5MB" }, { status: 400 });
    }

    // Generate nama unik
    const ext = EXT_MAP[type] || "jpg";
    const random = Math.random().toString(36).slice(2, 10);
    const fileName = `${Date.now()}-${random}.${ext}`;
    const filePath = `uploads/${fileName}`;

    // Upload ke Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Ambil public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    revalidatePath("/");

    return Response.json({ publicUrl: urlData.publicUrl, path: data.path });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Gagal upload file: " + (error.message || "") }, { status: 500 });
  }
}
