import { getGaleri, getKategoriGaleri } from "@/lib/supabase-queries";
import GaleriClient from "@/components/GaleriClient";

export const metadata = {
  title: "Galeri - Jorong Padang Panjang Pariangan",
  description:
    "Jelajahi galeri visual kegiatan dan lanskap Jorong Padang Panjang, Nagari Pariangan — dari kerja bakti hingga festival budaya.",
};

export default async function GaleriPage() {
  const [galeriList, kategoriGaleri] = await Promise.all([
    getGaleri(),
    getKategoriGaleri(),
  ]);

  return (
    <>
      {/* Header */}
      <header className="h-[150px] bg-gradient-to-r from-surface-container to-surface-container-low flex flex-col justify-center items-center text-center px-margin-mobile relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-section-title text-[28px] font-bold text-on-surface mb-2">
            Galeri Kegiatan
          </h1>
          <p className="font-body-md text-on-surface-variant text-body-md">
            Jelajahi setiap momen dan aktivitas dari Jorong Padang Panjang, Nagari
            Pariangan yang memajukan kebersamaan dan kemandirian.
          </p>
        </div>
      </header>

      <GaleriClient galeriList={galeriList} kategoriGaleri={kategoriGaleri} />
    </>
  );
}
