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
      {/* Header — pt-[72px] agar tidak tertutup navbar fixed */}
      <header className="pt-[72px] pb-12 bg-gradient-to-r from-background to-surface-container-low flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1
            className="font-heading font-bold text-text-primary mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2rem)", letterSpacing: "-0.01em" }}
          >
            Kontak
          </h1>
          <p className="text-text-secondary">
            Silahkan hubungi kami — kami terbuka untuk aspirasi, saran, dan kerjasama
            untuk kemajuan Jorong Padang Panjang, Nagari Pariangan.
          </p>
        </div>
      </header>

      <KontakClient desaInfo={desaInfo} />
    </>
  );
}
