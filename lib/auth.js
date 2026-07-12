// lib/auth.js
// Simple password-based auth untuk admin panel.
// Token session disimpan di cookie httpOnly "admin_session".
// ============================================================================
// SETUP:
//   Isi ADMIN_PASSWORD di .env.local
//   ADMIN_SESSION_TOKEN opsional (kalau kosong, di-generate otomatis via
//   crypto.randomBytes saat server start — session hilang saat restart,
//   admin harus login ulang). Set value stabil di env kalau ingin session
//   persist antar restart.
// ============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const STATIC_TOKEN = process.env.ADMIN_SESSION_TOKEN || "";

export const SESSION_COOKIE = "admin_session";

/** Verifikasi password admin */
export function verifyLogin(password) {
  if (!ADMIN_PASSWORD) {
    return false;
  }
  return password === ADMIN_PASSWORD;
}

/** Cek apakah request punya cookie session valid */
export function requireAdmin(request) {
  const val = request.cookies.get(SESSION_COOKIE)?.value;
  return Boolean(val && val === STATIC_TOKEN);
}

/** Untuk middleware (Edge runtime) */
export function requireAdminFromCookieValue(cookieValue) {
  return Boolean(cookieValue && cookieValue === STATIC_TOKEN);
}

/** Generate token (dari env) */
export function generateToken() {
  return STATIC_TOKEN;
}
