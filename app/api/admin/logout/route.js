// app/api/admin/logout/route.js
// POST /api/admin/logout — clear cookie session

import { SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
