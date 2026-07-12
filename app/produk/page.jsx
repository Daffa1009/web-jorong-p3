import { getProduk, getKategoriProduk } from "@/lib/supabase-queries";
import ProdukClient from "@/components/ProdukClient";

export const metadata = {
  title: "Produk Unggulan - Jorong Padang Panjang Pariangan",
  description:
    "Temukan berbagai hasil karya, hasil bumi, dan kuliner otentik dari Jorong Padang Panjang, Nagari Pariangan.",
};

export default async function ProdukPage() {
  const [produkList, kategoriProduk] = await Promise.all([
    getProduk(),
    getKategoriProduk(),
  ]);

  return (
    <>
      {/* Header */}
      <header className="h-[150px] bg-gradient-to-r from-surface-container to-surface-container-low flex flex-col justify-center items-center text-center px-margin-mobile relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-section-title text-[28px] font-bold text-on-surface mb-2">
            Produk Unggulan Desa
          </h1>
          <p className="font-body-md text-on-surface-variant text-body-md">
            Temukan berbagai hasil karya, hasil bumi, dan kuliner otentik langsung dari
            tangan terampil warga Jorong Padang Panjang, Nagari Pariangan.
          </p>
        </div>
      </header>

      <ProdukClient produkList={produkList} kategoriProduk={kategoriProduk} />
    </>
  );
}
