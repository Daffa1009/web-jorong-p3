-- ============================================================================
-- SEED DATA — Data Awal Jorong Padang Panjang, Nagari Pariangan
-- ============================================================================
-- CARA MENJALANKAN:
--   Setelah menjalankan schema.sql, jalankan file ini di Supabase SQL Editor
--   untuk mengisi tabel-tabel dengan data awal.
--   NOTE: Jika tabel sudah ada isinya, jalankan dulu DELETE FROM produk; dll.
-- ============================================================================

-- === DESA INFO ===
-- Update/insert row id=1 (upsert)
INSERT INTO desa_info (id, nama_desa, tagline, sejarah_teks, visi, misi, alamat_kantor, telepon, email, jam_operasional, instagram, facebook, whatsapp, foto_hero_url, foto_sejarah_url, timeline)
VALUES (
  1,
  'Jorong Padang Panjang',
  'Merawat Tradisi di Nagari Tuo, Membangun Kemandirian yang Lestari.',
  E'Nagari Pariangan dikenal secara luas dalam tambo Minangkabau sebagai Nagari Tuo, tempat asal mula peradaban dan nenek moyang masyarakat Minangkabau berkembang dari puncak Gunung Marapi. Jorong Padang Panjang merupakan salah satu wilayah adat penting di dalam struktur Nagari Pariangan yang sejak dahulu kala ikut menjaga kelestarian tatanan adat Sarat Nan Ampek.\n\nMasyarakat di Jorong Padang Panjang hidup berdampingan dengan bentang alam agraris di lereng Gunung Marapi. Secara turun-temurun, pola kehidupan sosial di wilayah ini diatur oleh sistem persukuan yang kuat. Wilayah ini tidak hanya menjadi saksi perkembangan adat, tetapi juga pusat aktivitas pertanian subur yang menopang kebutuhan logistik nagari sejak zaman pemerintahan kolonial hingga masa kemerdekaan.\n\nSeiring berjalannya waktu, Jorong Padang Panjang terus berbenah tanpa meninggalkan akar budayanya. Modernisasi yang masuk disikapi dengan pemanfaatan teknologi untuk pertanian dan tata kelola administrasi, menjadikan jorong ini sebagai bagian penting dari destinasi wisata budaya dan sejarah Nagari Pariangan yang diakui secara internasional.',
  'Mewujudkan Jorong Padang Panjang yang maju, mandiri, dan sejahtera berbasis pertanian dan pariwisata budaya dengan berlandaskan Adat Basandi Syarak, Syarak Basandi Kitabullah.',
  '[
    {"judul": "Infrastruktur & Fasilitas", "deskripsi": "Meningkatkan kualitas infrastruktur jalan usaha tani dan fasilitas publik jorong.", "icon": "agriculture"},
    {"judul": "Ekonomi & Pertanian", "deskripsi": "Mengembangkan potensi UMKM lokal dan pertanian berbasis teknologi ramah lingkungan.", "icon": "eco"},
    {"judul": "Pelestarian Adat & Budaya", "deskripsi": "Melestarikan nilai-nilai adat, budaya Minangkabau, dan kehidupan beragama di tengah masyarakat.", "icon": "diversity_3"},
    {"judul": "Tata Kelola Digital", "deskripsi": "Mewujudkan tata kelola pelayanan jorong yang transparan, cepat, dan berbasis digital.", "icon": "verified_user"}
  ]'::jsonb,
  'Kantor Wali Nagari Pariangan, Jalan Raya Pariangan, Kecamatan Pariangan, Kabupaten Tanah Datar, Sumatera Barat',
  '+62 812-xxxx-xxxx',
  'jorongpadangpanjang.pariangan@gmail.com',
  '{"senin_jumat": "08:00 - 16:00 WIB", "sabtu_minggu": "Tutup"}'::jsonb,
  '@jorongpadangpanjang_pariangan',
  'Jorong Padang Panjang Pariangan Maju',
  'https://wa.me/62812xxxxxxxx',
  'https://picsum.photos/1600/900?random=100',
  'https://picsum.photos/800/600?random=50',
  '[
    {"tahun": "Abad ke-14 (Era Prakemerdekaan)", "keterangan": "Pembangunan tatanan adat awal di wilayah Pariangan, di mana wilayah Padang Panjang mulai dihuni sebagai area perluasan pemukiman dan pertanian lereng marapi."},
    {"tahun": "1945", "keterangan": "Konsolidasi pemerintahan lokal pasca-kemerdekaan RI, mengintegrasikan sistem pemerintahan adat (Nagari) dengan administrasi NKRI."},
    {"tahun": "2001", "keterangan": "Pemberlakuan kembali sistem Pemerintahan Nagari di Sumatera Barat (Babaliak ka Nagari), mempertegas fungsi Jorong Padang Panjang sebagai bagian dari kesatuan masyarakat hukum adat Nagari Pariangan."},
    {"tahun": "2016", "keterangan": "Pengakuan Nagari Pariangan (termasuk Jorong Padang Panjang di dalamnya) sebagai salah satu Desa Terindah di Dunia oleh media internasional, memicu perkembangan sektor pariwisata berbasis komunitas."}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  nama_desa = EXCLUDED.nama_desa,
  tagline = EXCLUDED.tagline,
  sejarah_teks = EXCLUDED.sejarah_teks,
  visi = EXCLUDED.visi,
  misi = EXCLUDED.misi,
  alamat_kantor = EXCLUDED.alamat_kantor,
  telepon = EXCLUDED.telepon,
  email = EXCLUDED.email,
  jam_operasional = EXCLUDED.jam_operasional,
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  whatsapp = EXCLUDED.whatsapp,
  foto_hero_url = EXCLUDED.foto_hero_url,
  foto_sejarah_url = EXCLUDED.foto_sejarah_url,
  timeline = EXCLUDED.timeline;

-- === PRODUK ===
INSERT INTO produk (nama, kategori, deskripsi, harga, pengrajin, foto_url) VALUES
  (
    'Kopi Kawa Daun (Minuman Tradisional)',
    'Makanan',
    'Minuman khas dari daun kopi lokal yang dikeringkan lalu diseduh di dalam batok kelapa.',
    'Rp 5.000 - Rp 10.000 per porsi',
    'Kedai Kawa Daun Tradisional Pariangan',
    'https://picsum.photos/600/400?random=20'
  ),
  (
    'Beras Organik Pariangan',
    'Pertanian',
    'Beras hasil sawah berundak lereng Marapi yang dialiri air pegunungan langsung tanpa pestisida kimia.',
    'Rp 15.000 / Kg',
    'Kelompok Tani Usaha Bersama Padang Panjang',
    'https://picsum.photos/600/400?random=21'
  ),
  (
    'Kerajinan Souvenir Rumah Gadang & Anyaman Bambu',
    'Kerajinan',
    'Miniatur Rumah Gadang berbahan kayu jorong lokal dan anyaman bambu penunjang wisata.',
    'Rp 25.000 - Rp 150.000 (tergantung ukuran)',
    'Pengrajin Seni Pemuda Pariangan',
    'https://picsum.photos/600/400?random=22'
  );

-- === GALERI ===
INSERT INTO galeri (judul, kategori, tanggal, foto_url) VALUES
  (
    'Gotong Royong Kebersihan Jalan Jorong dan Saluran Irigasi',
    'Sosial Kepemudaan',
    '2026-05-12',
    'https://picsum.photos/800/600?random=30'
  ),
  (
    'Penanaman Bibit Padi Serentak Lereng Marapi',
    'Pertanian & Ekonomi',
    '2026-06-20',
    'https://picsum.photos/800/600?random=31'
  ),
  (
    'Pelatihan Administrasi Digital bagi Perangkat Jorong',
    'Pemerintahan',
    '2026-07-04',
    'https://picsum.photos/800/600?random=32'
  ),
  (
    'Festival Budaya Nagari Tuo Tahunan',
    'Budaya',
    '2026-06-10',
    'https://picsum.photos/800/600?random=33'
  ),
  (
    'Perbaikan Jembatan Penghubung Sawah Berundak',
    'Infrastruktur',
    '2026-04-18',
    'https://picsum.photos/800/600?random=34'
  ),
  (
    'Diskusi Adat: Peran Pemuda dalam Menjaga Tradisi Sarat Nan Ampek',
    'Sosial Kepemudaan',
    '2026-03-22',
    'https://picsum.photos/800/600?random=35'
  );
