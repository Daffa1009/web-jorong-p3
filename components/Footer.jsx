import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative overflow-hidden" style={{ backgroundColor: "#004643" }}>
      {/* Subtle decorative overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(242,166,90,0.08), transparent 50%)",
        }}
        aria-hidden="true"
      />

      {/* Main 3-column grid */}
      <div className="relative max-w-[1280px] mx-auto px-4 md:px-8 pt-14 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Kolom 1: Brand + tagline + sosmed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image
                src="/logo_desa.png"
                alt="Logo Desa Jorong Padang Panjang"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-white block leading-snug">
                Jorong Padang Panjang Pariangan
              </span>
              <span className="text-sm text-white/60 font-medium">Nagari Pariangan</span>
            </div>
          </div>
          <p className="text-sm text-white/65 leading-relaxed max-w-xs">
            Portal resmi informasi dan pelayanan masyarakat Jorong Padang Panjang,
            Nagari Pariangan — Merawat tradisi, membangun kemandirian.
          </p>
          {/* Social media icons */}
          <div className="flex gap-3 mt-1">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-white/60 hover:text-gold hover:border-gold transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-white/60 hover:text-gold hover:border-gold transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-white/60 hover:text-gold hover:border-gold transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi */}
        <div className="flex flex-col gap-3">
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-1">
            Navigasi
          </h4>
          {[
            { href: "/", label: "Beranda" },
            { href: "/profil", label: "Profil Desa" },
            { href: "/produk", label: "Produk Unggulan" },
            { href: "/galeri", label: "Galeri Kegiatan" },
            { href: "/forum", label: "Forum Diskusi" },
            { href: "/kontak", label: "Hubungi Kami" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/65 hover:text-white transition-colors duration-200 w-fit"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Kolom 3: Kontak */}
        <div className="flex flex-col gap-3">
          <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-1">
            Kontak
          </h4>
          <div className="flex items-start gap-2.5 text-sm text-white/65">
            <span className="material-symbols-outlined text-[16px] mt-0.5 text-gold/80 shrink-0">location_on</span>
            <span className="leading-relaxed">
              Nagari Padang Panjang Pariangan, Kec. Pariangan,<br />
              Kab. Tanah Datar, Sumatera Barat
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-white/65">
            <span className="material-symbols-outlined text-[16px] text-gold/80 shrink-0">call</span>
            <a href="tel:+62" className="hover:text-white transition-colors">
              +6282311544138
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-white/65">
            <span className="material-symbols-outlined text-[16px] text-gold/80 shrink-0">mail</span>
            <a href="mailto:nagari@pariangan.go.id" className="hover:text-white transition-colors break-all">
              nagari@padangpanjangpariangan.go.id
            </a>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-white/65">
            <span className="material-symbols-outlined text-[16px] text-gold/80 shrink-0">schedule</span>
            <span>Senin – Jumat, 08.00 – 16.00 WIB</span>
          </div>
        </div>
      </div>

      {/* Divider + Copyright */}
      <div className="relative border-t border-white/10 py-5 text-center">
        <p className="text-xs text-white/45">
          © 2026 Jorong Padang Panjang, Nagari Pariangan. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
