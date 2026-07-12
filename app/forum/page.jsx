// app/forum/page.jsx
// Halaman utama forum (Server Component)

import { getForumTopik } from "@/lib/supabase-queries";
import ForumPageClient from "@/components/ForumPageClient";

export const revalidate = 0; // Pastikan data selalu segar (SSR)

export default async function ForumPage() {
  const topics = await getForumTopik();

  return (
    <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg">
      <ForumPageClient initialThreads={topics} />
    </div>
  );
}
