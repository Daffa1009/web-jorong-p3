// app/robots.js
// Konfigurasi robots.txt untuk crawler
// - Izinkan akses ke semua halaman publik
// - LARANG akses ke /admin dan /api/admin
// - Tautkan ke sitemap.xml

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webjorongp3.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/admin", "/api/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
