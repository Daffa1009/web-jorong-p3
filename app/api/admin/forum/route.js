// app/api/admin/forum/route.js
// GET /api/admin/forum -> list semua topik untuk halaman admin (requireAdmin)

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured } from "@/lib/supabase";

export async function GET(request) {
  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminSupabaseConfigured || !supabaseAdmin) {
    return Response.json(
      { data: [], note: "Supabase belum dikonfigurasi" },
      { status: 200 }
    );
  }

  try {
    const { data: topics, error: topicsError } = await supabaseAdmin
      .from("forum_topik")
      .select("*")
      .order("created_at", { ascending: false });

    if (topicsError) throw topicsError;

    if (topics.length === 0) {
      return Response.json({ data: [] });
    }

    const topicIds = topics.map((t) => t.id);

    // Fetch komentar count
    const { data: allKomentar } = await supabaseAdmin
      .from("forum_komentar")
      .select("topik_id")
      .in("topik_id", topicIds);

    const countMap = {};
    if (allKomentar) {
      allKomentar.forEach((k) => {
        countMap[k.topik_id] = (countMap[k.topik_id] || 0) + 1;
      });
    }

    const data = topics.map((t) => ({
      ...t,
      penulis: t.nama_penulis,
      avatar: t.avatar_url,
      jumlahKomentar: countMap[t.id] || 0,
    }));

    return Response.json({ data });
  } catch (error) {
    console.error("Admin list forum error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
