// app/forum/page.jsx
// Halaman utama forum (Server Component)

import { getForumTopik } from "@/lib/supabase-queries";
import ForumPageClient from "@/components/ForumPageClient";

export const revalidate = 0; // Pastikan data selalu segar (SSR)

export default async function ForumPage() {
  const topics = await getForumTopik();

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-[96px] pb-16">
      <ForumPageClient initialThreads={topics} />
    </div>
  );
}
