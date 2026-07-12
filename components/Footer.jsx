import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary w-full min-h-[200px] mt-auto relative overflow-hidden">
      {/* Subtle radial gradient (B6) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(254,182,60,0.10), transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Brand */}
        <div className="flex flex-col gap-sm">
          <span className="font-section-title text-section-title font-bold text-on-primary">
            Jorong Padang Panjang Pariangan
          </span>
          <p className="font-label-sm text-label-sm text-on-primary/80 max-w-xs">
            Portal resmi informasi dan pelayanan administrasi masyarakat Jorong Padang
            Panjang, Nagari Pariangan.
          </p>
        </div>

        {/* Quick Links 1 */}
        <div className="flex flex-col gap-2">
          <h4 className="font-label-sm text-label-sm font-bold text-on-primary mb-2">
            Tautan Cepat
          </h4>
          <Link
            href="/"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Profil
          </Link>
          <Link
            href="/produk"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Produk
          </Link>
        </div>

        {/* Quick Links 2 */}
        <div className="flex flex-col gap-2">
          <h4 className="font-label-sm text-label-sm font-bold text-on-primary mb-2">
            Lainnya
          </h4>
          <Link
            href="/galeri"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Galeri
          </Link>
          <Link
            href="/forum"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Forum
          </Link>
          <Link
            href="/kontak"
            className="font-label-sm text-label-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
          >
            Kontak
          </Link>
        </div>
      </div>
      <div className="relative border-t border-on-primary/20 py-4 text-center">
        <p className="font-label-sm text-label-sm text-on-primary/60">
          © 2026 Jorong Padang Panjang, Nagari Pariangan.
        </p>
      </div>
    </footer>
  );
}
