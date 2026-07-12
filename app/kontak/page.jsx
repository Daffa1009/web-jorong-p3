import { getDesaInfo } from "@/lib/supabase-queries";
import KontakClient from "@/components/KontakClient";

export const metadata = {
  title: "Kontak - Jorong Padang Panjang Pariangan",
  description:
    "Informasi kontak resmi Wali Nagari Pariangan, alamat kantor di Kecamatan Pariangan, Tanah Datar, Sumatera Barat.",
};

export default async function KontakPage() {
  const desaInfo = await getDesaInfo();

  return (
    <>
      {/* Header */}
      <header className="h-[150px] bg-gradient-to-r from-surface to-surface-container-low flex flex-col justify-center items-center text-center px-margin-mobile relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-section-title text-[28px] font-bold text-on-surface mb-2">
            Kontak
          </h1>
          <p className="font-body-md text-on-surface-variant text-body-md">
            Silahkan hubungi kami — kami terbuka untuk aspirasi, saran, dan kerjasama
            untuk kemajuan Jorong Padang Panjang, Nagari Pariangan.
          </p>
        </div>
      </header>

      <KontakClient desaInfo={desaInfo} />
    </>
  );
}
