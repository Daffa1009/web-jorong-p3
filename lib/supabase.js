// @supabase/supabase-js
// ============================================================================
// SETUP SUPABASE
// ============================================================================
//
// SEBELUM MENJALANKAN PROJECT, isi file `.env.local` dengan:
//   NEXT_PUBLIC_SUPABASE_URL=        -> URL project Supabase (dashboard > Project Settings > API)
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=   -> anon public key (dashboard > Project Settings > API)
//   SUPABASE_SERVICE_ROLE_KEY=       -> service_role key (RAHASIA, jangan expose ke browser)
//
// BUCKET STORAGE:
//   Nama bucket: "desa-images"
//   - Public access untuk READ
//   - Restrict file size 5MB
//   - MIME type: image/jpeg, image/png, image/webp
//   (Buat bucket di Supabase Dashboard > Storage, lalu set policy public read)
//
// JANGAN generate value asli apa pun di sini.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Client-side Supabase (anon key) — untuk READ data publik.
 * Aman diekspos ke browser. RLS policy mengizinkan public SELECT.
 */
export const supabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Admin Supabase (service role key) — HANYA server-side (API routes).
 * Bypass RLS. JANGAN pernah import di client component atau expose ke browser.
 */
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/**
 * Generate public URL untuk file di bucket "desa-images".
 */
export function getPublicUrl(path) {
  if (!supabaseClient) return "";
  const { data } = supabaseClient.storage.from("desa-images").getPublicUrl(path);
  return data?.publicUrl || "";
}

/**
 * Ekstrak path file dari public URL Supabase Storage
 * (untuk hapus file lama saat update/delete).
 */
export function extractStoragePath(publicUrl) {
  if (!publicUrl || !supabaseUrl) return null;
  try {
    const prefix = `/storage/v1/object/public/desa-images/`;
    const idx = publicUrl.indexOf(prefix);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.slice(idx + prefix.length));
  } catch {
    return null;
  }
}

/** Konstanta bucket name */
export const STORAGE_BUCKET = "desa-images";

/** Cek apakah Supabase sudah dikonfigurasi */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isAdminSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);
