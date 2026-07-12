// lib/admin-fetch.js
// Client-side fetch wrapper yang otomatis include credentials (cookie admin_session).
// Gunakan ini untuk semua panggilan ke /api/admin/* agar cookie session terkirim.

const BASE = "";

export async function adminFetch(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${BASE}${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  });

  return res;
}
