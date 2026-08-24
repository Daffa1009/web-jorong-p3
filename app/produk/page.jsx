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
      {/* Header — pt-[72px] agar tidak tertutup navbar fixed */}
      <header className="pt-[72px] pb-12 bg-gradient-to-r from-surface-container-low to-background flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1
            className="font-heading font-bold text-text-primary mb-2"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2rem)", letterSpacing: "-0.01em" }}
          >
            Produk Unggulan Desa
          </h1>
          <p className="text-text-secondary">
            Temukan berbagai hasil karya, hasil bumi, dan kuliner otentik langsung dari
            tangan terampil warga Jorong Padang Panjang, Nagari Pariangan.
          </p>
        </div>
      </header>

      <ProdukClient produkList={produkList} kategoriProduk={kategoriProduk} />
    </>
  );
}
