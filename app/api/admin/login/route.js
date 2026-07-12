// app/api/admin/login/route.js
// POST /api/admin/login — verifikasi password, set cookie session

import { SESSION_COOKIE, verifyLogin, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD) {
    return Response.json(
      { error: "ADMIN_PASSWORD belum diisi di .env.local. Silahkan isi terlebih dahulu." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const { password } = body || {};

  if (!verifyLogin(password)) {
    return Response.json({ error: "Password salah" }, { status: 401 });
  }

  const token = generateToken();
  if (!token) {
    return Response.json(
      { error: "ADMIN_SESSION_TOKEN belum diisi di .env.local. Isi dengan string acak 64 karakter." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 jam
  });

  return Response.json({ ok: true });
}
