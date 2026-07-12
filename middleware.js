// middleware.js
// Proteksi route /admin/* kecuali /admin/login — baca cookie admin_session.
// NOTE: Edge runtime tidak support Node.js crypto, jadi kita tidak import lib/auth.
// Pastikan ADMIN_SESSION_TOKEN diisi di env agar session stabil.

import { NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

const SESSION_COOKIE = "admin_session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Login page boleh diakses tanpa auth
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Cek cookie session
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const validToken = process.env.ADMIN_SESSION_TOKEN || "";

  if (!validToken) {
    // Token belum diset — redirect ke login (admin harus login dulu)
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!token || token !== validToken) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
