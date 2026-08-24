import { getProduk, getLatestGaleriWithPhotos, getDesaInfo } from "@/lib/supabase-queries";
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "Beranda - Jorong Padang Panjang Pariangan",
  description: "Selamat datang di portal resmi Jorong Padang Panjang, Nagari Pariangan. Temukan info sejarah, produk unggulan, galeri kegiatan, dan hubungi kami.",
};

export default async function Home() {
  const [produkList, galeriList, desaInfo] = await Promise.all([
    getProduk(),
    getLatestGaleriWithPhotos(4),
    getDesaInfo(),
  ]);

  const produkPreview = produkList.slice(0, 3);
  const galeriPreview = galeriList; // Sudah dilimit 4 di server query

  return (
    <HomeClient
      produkPreview={produkPreview}
      galeriPreview={galeriPreview}
      desaInfo={desaInfo}
    />
  );
}
