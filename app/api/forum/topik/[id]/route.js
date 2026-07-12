// app/api/forum/topik/[id]/route.js
// GET /api/forum/topik/[id] -> detail 1 topik + semua komentarnya

import { getForumTopikById } from "@/lib/supabase-queries";

export async function GET(request, { params }) {
  const { id } = params;
  const topic = await getForumTopikById(id);
  if (!topic) {
    return Response.json({ error: "Topik tidak ditemukan" }, { status: 404 });
  }
  return Response.json({ data: topic });
}
