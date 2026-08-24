import { getDesaInfo } from "@/lib/supabase-queries";
import ProfileTabs from "@/components/ProfileTabs";

export const metadata = {
  title: "Profil - Jorong Padang Panjang Pariangan",
  description:
    "Mengenal lebih dekat sejarah, visi-misi, dan letak geografis Jorong Padang Panjang, Nagari Pariangan — bagian dari Nagari Tuo Minangkabau.",
};

export default async function ProfilPage() {
  const desaInfo = await getDesaInfo();

  return (
    <>
      {/* Page Header — pt-[72px] agar tidak tertutup navbar fixed */}
      <header className="pt-[72px] bg-surface-container-low pb-10 border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
          <h1 className="font-heading font-extrabold text-text-primary mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.02em" }}>
            Profil Jorong
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat sejarah, visi-misi, dan letak geografis Jorong Padang
            Panjang Pariangan sebagai bagian dari Nagari Tuo Minangkabau yang lestari dan mandiri.
          </p>
        </div>
      </header>

      {/* Tabbed Content */}
      <ProfileTabs desaInfo={desaInfo} />
    </>
  );
}
