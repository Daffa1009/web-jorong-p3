-- ============================================================
-- MIGRASI: Fitur Multi-Foto per Kegiatan Galeri
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Tabel baru untuk menyimpan foto-foto dalam satu kegiatan
CREATE TABLE IF NOT EXISTS galeri_foto (
  id          uuid primary key default gen_random_uuid(),
  galeri_id   uuid not null references galeri(id) on delete cascade,
  foto_url    text not null,
  urutan      integer default 0,
  created_at  timestamp with time zone default now()
);

ALTER TABLE galeri_foto ENABLE ROW LEVEL SECURITY;

-- Policy untuk read publik (karena tidak memakai Auth Supabase untuk user biasa)
CREATE POLICY "Public can view galeri foto"
  ON galeri_foto FOR SELECT USING (true);

-- Policy untuk write (hanya bypass via service_role API backend)
CREATE POLICY "Only admin can insert galeri foto"
  ON galeri_foto FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only admin can delete galeri foto"
  ON galeri_foto FOR DELETE USING (auth.role() = 'service_role');

-- 2. Tambah kolom foto_cover ke tabel galeri (foto utama yang tampil di thumbnail)
ALTER TABLE galeri ADD COLUMN IF NOT EXISTS foto_cover text;

-- 3. Migrasi data lama: salin foto_url ke foto_cover untuk data yang sudah ada
UPDATE galeri SET foto_cover = foto_url WHERE foto_cover IS NULL AND foto_url IS NOT NULL;

-- 4. Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_galeri_foto_galeri_id ON galeri_foto(galeri_id);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_urutan ON galeri_foto(galeri_id, urutan);
