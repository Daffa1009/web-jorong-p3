import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "Jorong Padang Panjang Pariangan- Portal Resmi",
  description:
    "Portal resmi Jorong Padang Panjang, Nagari Pariangan — Pusat informasi dan layanan terpadu masyarakat. Merawat Tradisi di Nagari Tuo, Membangun Kemandirian yang Lestari.",
  keywords: "Jorong Padang Panjang, Nagari Pariangan, Tanah Datar, Sumatera Barat, portal desa, Nagari Tuo, Minangkabau",
  openGraph: {
    title: "Jorong Padang Panjang Pariangan- Portal Resmi",
    description: "Portal resmi informasi dan layanan masyarakat Jorong Padang Panjang, Nagari Pariangan",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased font-body-md text-body-md min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
