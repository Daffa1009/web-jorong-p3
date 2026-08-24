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
      {/* Header — pt-[72px] agar tidak tertutup navbar fixed */}
      <header className="pt-[72px] h-auto py-12 bg-gradient-to-r from-surface-container-low to-background flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1
            className="font-heading font-bold text-text-primary mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2rem)", letterSpacing: "-0.01em" }}
          >
            Galeri Kegiatan
          </h1>
          <p className="text-text-secondary">
            Jelajahi setiap momen dan aktivitas dari Jorong Padang Panjang, Nagari
            Pariangan yang memajukan kebersamaan dan kemandirian.
          </p>
        </div>
      </header>

      <GaleriClient galeriList={galeriList} kategoriGaleri={kategoriGaleri} />
    </>
  );
}
