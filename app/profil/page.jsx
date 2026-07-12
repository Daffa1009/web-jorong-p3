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
      {/* Page Header */}
      <header className="bg-surface-container-low py-lg border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h1 className="font-hero-lg-mobile md:font-hero-lg text-hero-lg-mobile md:text-hero-lg text-on-surface mb-sm">
            Profil Jorong
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
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
