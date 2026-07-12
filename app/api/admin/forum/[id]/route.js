// app/api/admin/forum/[id]/route.js
// DELETE /api/admin/forum/[id] -> hapus topik (khusus admin, cek cookie)

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin, isAdminSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!requireAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminSupabaseConfigured || !supabaseAdmin) {
    return Response.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 500 }
    );
  }

  try {
    const { error } = await supabaseAdmin
      .from("forum_topik")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/forum");
    revalidatePath(`/forum/${id}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Admin delete forum error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
