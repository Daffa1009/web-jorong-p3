// lib/peta-utils.js
// Normalisasi berbagai format input URL Google Maps menjadi URL embed yang
// valid untuk <iframe>. Dipakai oleh form admin (preview & simpan) dan
// komponen publik (render peta).

/**
 * Mengubah input menjadi URL embed Google Maps yang valid.
 * Mendukung:
 *   1. Kode HTML <iframe src="..."> lengkap  -> diekstrak src-nya
 *   2. URL embed (output=embed / /maps/embed) -> dipakai apa adanya
 *   3. URL Google Maps biasa dengan ?q=       -> dikonversi ke output=embed
 *   4. Short link (maps.app.goo.gl) dll.      -> "" (tidak bisa di-embed)
 *
 * Return "" jika input kosong atau tidak dapat dikonversi.
 */
export function normalizePetaEmbedUrl(input) {
  if (!input) return "";
  let url = String(input).trim();
  if (!url) return "";

  // 1) User menempel seluruh kode <iframe ...> -> ambil nilai src
  const srcMatch = url.match(/src=["']([^"']+)["']/i);
  if (srcMatch) url = srcMatch[1].trim();

  // 2) Sudah merupakan URL embed yang valid
  if (/output=embed/i.test(url) || /\/maps\/embed/i.test(url)) {
    return url;
  }

  // 3) URL Google Maps biasa -> konversi ke format embed
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const isGoogleMaps = /(^|\.)google\.[a-z.]+$/.test(host) && /\/maps/i.test(u.pathname);
    if (isGoogleMaps) {
      const q = u.searchParams.get("q") || u.searchParams.get("query");
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
      // URL /maps/place/<nama>/... tanpa parameter q
      const parts = u.pathname.split("/").filter(Boolean);
      const placeIdx = parts.indexOf("place");
      if (placeIdx !== -1 && parts[placeIdx + 1]) {
        const place = decodeURIComponent(parts[placeIdx + 1]).replace(/\+/g, " ");
        return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
      }
    }
  } catch {
    // bukan URL yang valid — jatuh ke return ""
  }

  // 4) Tidak bisa dikonversi (mis. https://maps.app.goo.gl/xxxx)
  return "";
}
