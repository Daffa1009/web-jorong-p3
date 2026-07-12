-- ============================================================================
-- SEED DATA — FORUM DISKUSI
-- ============================================================================
-- CARA MENJALANKAN:
--   Setelah menjalankan schema_forum.sql, jalankan file ini
--   di Supabase SQL Editor untuk mengisi topik + komentar dummy.
-- ============================================================================

-- Insert topik dummy (5 topik)
DO $$
DECLARE
  t1 UUID;
  t2 UUID;
  t3 UUID;
  t4 UUID;
  t5 UUID;
BEGIN
  -- Topik 1: Jadwal Kerja Bakti
  INSERT INTO forum_topik (judul, kategori, isi, nama_penulis, created_at)
  VALUES (
    'Jadwal Kerja Bakti Minggu Ini - Dusun Mawar',
    'Pengumuman',
    'Bapak/Ibu sekalian, mengingat curah hujan yang mulai tinggi, kita akan mengadakan kerja bakti pembersihan selokan dan saluran air di seluruh wilayah Dusun Mawar. Mohon partisipasi seluruh warga untuk hadir membawa peralatan kebersihan masing-masing. Kegiatan akan dilaksanakan pada hari Minggu pagi pukul 07.00 WIB. Mari bersama menjaga kebersihan dan kenyamanan lingkungan kita.',
    'Kepala Desa',
    '2024-07-06 08:30:00+07'
  )
  RETURNING id INTO t1;

  -- Topik 2: Usulan Lampu Jalan
  INSERT INTO forum_topik (judul, kategori, isi, nama_penulis, created_at)
  VALUES (
    'Usulan Penambahan Lampu Jalan di Pertigaan RT 03',
    'Aspirasi',
    'Mohon pertimbangan perangkat desa, kondisi pertigaan RT 03 sangat gelap saat malam hari dan rawan kecelakaan. Sudah beberapa kali terjadi kejadian hampir tabrakan antara motor dan pejalan kaki. Saya mengusulkan pemasangan minimal 2 lampu jalan di area tersebut. Anggaran bisa diambilkan dari dana desa atau gotong royong warga.',
    'Andi Pratama',
    '2024-07-05 19:45:00+07'
  )
  RETURNING id INTO t2;

  -- Topik 3: Tips Tanaman Cabai
  INSERT INTO forum_topik (judul, kategori, isi, nama_penulis, created_at)
  VALUES (
    'Tips Perawatan Tanaman Cabai Saat Musim Kemarau',
    'Diskusi',
    'Adakah bapak/ibu yang punya pengalaman mengatasi hama keriting daun pada tanaman cabai saat suhu udara sangat panas? Tanaman cabai saya di kebun belakang sudah mulai terserang dan daunnya menguning. Saya sudah coba pakai pestisida nabati dari daun mimba tapi belum efektif. Mohon sarannya.',
    'Slamet Riyadi',
    '2024-07-04 10:15:00+07'
  )
  RETURNING id INTO t3;

  -- Topik 4: Mencari Pengrajin Bambu
  INSERT INTO forum_topik (judul, kategori, isi, nama_penulis, created_at)
  VALUES (
    'Mencari Pengrajin Bambu Lokal untuk Pagar',
    'Diskusi',
    'Saya berencana mengganti pagar rumah, apakah ada rekomendasi pengrajin bambu di sekitar desa kita yang hasilnya rapi dan harga terjangkau? Pagar lama saya dari kayu sudah mulai lapuk. Budget sekitar Rp 2-3 juta untuk panjang 15 meter. Terima kasih sebelumnya.',
    'Widyawati',
    '2024-07-03 14:20:00+07'
  )
  RETURNING id INTO t4;

  -- Topik 5: Lomba Desa Bersih
  INSERT INTO forum_topik (judul, kategori, isi, nama_penulis, created_at)
  VALUES (
    'Pendaftaran Lomba Desa Bersih Tingkat Kabupaten',
    'Pengumuman',
    'Dengan bangga kami informasikan bahwa Desa Sejahtera telah terdaftar sebagai peserta Lomba Desa Bersih Tingkat Kabupaten tahun ini. Penilaian akan dilakukan pada bulan depan. Untuk itu, kami mengajak seluruh warga untuk mulai menata lingkungan masing-masing. Kriteria penilaian meliputi kebersihan lingkungan, pengelolaan sampah, penghijauan, dan sanitasi. Mari kita buktikan bahwa Desa Sejahtera layak menjadi juara!',
    'Kepala Desa',
    '2024-07-01 08:00:00+07'
  )
  RETURNING id INTO t5;

  -- === Komentar ===

  -- Komentar untuk topik 1 (Kerja Bakti)
  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t1, 'Suryanto', 'Baik, siap hadir Pak. Saya bawa cangkul dan karung untuk sampah.', '2024-07-06 09:30:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t1, 'Ratna', 'Dusun Mawar RT 02 siap gotong royong. Kami koordinasi antar RT dulu ya untuk pembagian area.', '2024-07-06 10:00:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t1, 'Dian', 'Mohon informasi titik kumpulnya di mana ya Pak? Terima kasih.', '2024-07-06 10:45:00+07');

  -- Komentar untuk topik 2 (Lampu Jalan)
  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t2, 'Lestari', 'Sangat setuju! Saya yang sering lewat sana malam hari memang rawan sekali. Anak saya juga pernah hampir kecelakaan.', '2024-07-05 20:30:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t2, 'RT 03', 'Terima kasih masukannya, Mas Andi. Saya sudah catat dan akan bawa ke rapat desa minggu depan. Mohon doa restu warga.', '2024-07-06 06:15:00+07');

  -- Komentar untuk topik 3 (Tips Cabai)
  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t3, 'Tani Berpengalaman', 'Coba campurkan larutan tembakau + bawang putih, semprot setiap 3 hari sekali di pagi hari. Itu resep turun-temurun yang ampuh buat hama keriting.', '2024-07-05 12:00:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t3, 'Penyuluh Tani', 'Untuk musim kemarau, pastikan penyiraman cukup ya. Tanaman yang stres kekurangan air lebih rentan kena hama. Bisa juga pakai mulsa plastik untuk jaga kelembaban tanah.', '2024-07-06 15:00:00+07');

  -- Komentar untuk topik 4 (Pengrajin Bambu)
  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t4, 'Bambang', 'Rekomendasi ke Pak Suherman di RT 02 Bu, beliau spesialis anyaman bambu. Hasilnya rapi dan tahan lama. Harganya juga bersaing.', '2024-07-04 18:00:00+07');

  -- Komentar untuk topik 5 (Lomba Desa)
  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t5, 'Mariam', 'Wah kabar baik! Saya akan mulai bersihkan taman depan rumah. Semoga desa kita menang ya!', '2024-07-02 09:00:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t5, 'Ketua Karang Taruna', 'Karang Taruna siap bantu penataan taman desa dan mural hias. Kami sudah rapatkan dan akan mulai minggu depan.', '2024-07-02 16:00:00+07');

  INSERT INTO forum_komentar (topik_id, nama_penulis, isi, created_at)
  VALUES (t5, 'Iwan Susanto', 'Usul: bagaimana kalau kita adakan kerja bakti masal akhir pekan ini khusus untuk persiapan lomba? Biar semua serentak.', '2024-07-03 11:30:00+07');
END $$;
