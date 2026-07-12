import { getProduk, getGaleri, getDesaInfo } from "@/lib/supabase-queries";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const [produkList, galeriList, desaInfo] = await Promise.all([
    getProduk(),
    getGaleri(),
    getDesaInfo(),
  ]);

  const produkPreview = produkList.slice(0, 3);
  const galeriPreview = galeriList.slice(0, 4);

  return (
    <HomeClient
      produkPreview={produkPreview}
      galeriPreview={galeriPreview}
      desaInfo={desaInfo}
    />
  );
}
