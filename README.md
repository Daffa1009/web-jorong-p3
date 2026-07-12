# Website Jorong Padang Panjang, Nagari Pariangan

Portal resmi informasi dan layanan masyarakat Jorong Padang Panjang — bagian dari Nagari Tuo Minangkabau.

Dibangun dengan **Next.js 14 (App Router) + Tailwind CSS**, data disimpan di **Supabase** (PostgreSQL + Storage).

## Fitur

- **Beranda**: Hero parallax, produk unggulan, galeri kegiatan, CTA kontak.
- **Profil**: Sejarah, Visi-Misi, Peta + batas wilayah.
- **Produk**: Galeri produk unggulan lokal dengan filter dan detail modal.
- **Galeri**: Galeri foto kegiatan dengan filter dan lightbox.
- **Forum**: Forum diskusi warga (localStorage).
- **Kontak**: Alamat, kontak, sosial media, Google Maps, form pesan.
- **Admin Panel**: Login → Dashboard → CRUD Produk, Galeri, Info Desa via `/admin`.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS (Material 3 token)
- Supabase (PostgreSQL + Storage)
- Material Symbols (icon)
- Framer Motion (tersedia, belum banyak dipakai)

## Struktur Project

```
├── app/
│   ├── admin/          # Admin panel (login, dashboard, produk, galeri, info-desa)
│   ├── api/admin/      # API routes (login, logout, upload, CRUD produk/galeri/info-desa)
│   ├── forum/          # Forum diskusi (client, localStorage)
│   ├── galeri/         # Galeri page (async server + GaleriClient)
│   ├── kontak/         # Kontak page (async server + KontakClient)
│   ├── produk/         # Produk page (async server + ProdukClient)
│   ├── profil/         # Profil page (async server + ProfileTabs)
│   ├── page.jsx        # Beranda (async server + HomeClient)
│   ├── layout.jsx      # Root layout + metadata
│   └── globals.css     # Global styles + animations
├── components/         # UI components
├── data/               # Data fallback lokal (pakai kalau Supabase belum terisi)
├── lib/                # Supabase client, auth, queries
├── supabase/           # Schema SQL + Seed SQL
└── middleware.js       # Proteksi route /admin/* (Edge)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Isi environment variables

Copy `.env.example` ke `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=password_anda
ADMIN_SESSION_TOKEN=token_stabil_64_char  (opsional, untuk session persist)
```

> [!IMPORTANT]
> **ADMIN_SESSION_TOKEN wajib diisi** agar middleware Edge bisa verifikasi cookie.
> Kalau kosong, middleware akan selalu redirect ke login. Generate nilai acak 64 karakter.

### 3. Setup Supabase Database

1. Buka Supabase Dashboard → SQL Editor.
2. Jalankan [supabase/schema.sql](file:///d:/Web%20Desa/desa-sejahtera-next/supabase/schema.sql) — buat tabel & RLS policies.
3. Jalankan [supabase/seed.sql](file:///d:/Web%20Desa/desa-sejahtera-next/supabase/seed.sql) — isi data awal Jorong Padang Panjang.

### 4. Setup Storage Bucket

Buat bucket di Supabase Dashboard → Storage → New Bucket:
- **Name**: `desa-images`
- **Public**: ✅ (untuk READ)
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

### 5. Jalankan

```bash
npm run dev
```

Akses:
- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Deploy ke Vercel

1. Push project ke GitHub.
2. Import repo di Vercel.
3. Set **Environment Variables** yang sama di Vercel Dashboard → Settings → Environment Variables.
4. Deploy.

## Admin Panel

- Login di `/admin/login` dengan password dari `ADMIN_PASSWORD`.
- **Dashboard**: ringkasan jumlah data.
- **Produk**: Tambah / Edit / Hapus produk + upload foto.
- **Galeri**: Tambah / Edit / Hapus galeri + upload foto.
- **Info Desa**: Edit identitas, sejarah, visi-misi, timeline, kontak, sosial media, foto hero/sejarah.

## Catatan Sistem

- **Fallback data**: Kalau env Supabase belum diisi, website tetap jalan pakai data dari folder `/data`.
- **Forum**: DISKUSI tidak masuk ke Supabase. Data thread + komentar disimpan di localStorage browser (demo).
- **revalidatePath**: Setiap create/update/delete di API route secara otomatis merefresh cache halaman publik.
- **Admin foto upload**: Hanya jpg/png/webp, max 5MB. Foto baru disimpan ke bucket `desa-images`, foto lama otomatis dihapus dari storage saat diganti.
