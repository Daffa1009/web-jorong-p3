-- ============================================================================
-- DATABASE SCHEMA — Jorong Padang Panjang Website
-- ============================================================================
-- CARA MENJALANKAN:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste SELURUH isi file ini
--   3. Klik "Run" / tekan Ctrl+Enter
--   4. Tunggu sukses (akan muncul "Success. No rows returned")
-- ============================================================================

-- === TABEL: produk ===
CREATE TABLE IF NOT EXISTS produk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL,
  deskripsi TEXT,
  harga TEXT,
  pengrajin TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TABEL: galeri ===
CREATE TABLE IF NOT EXISTS galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL,
  tanggal DATE,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TABEL: desa_info ===
-- Single-row table (selalu id=1). Constraint memastikan hanya 1 baris.
CREATE TABLE IF NOT EXISTS desa_info (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nama_desa TEXT,
  tagline TEXT,
  sejarah_teks TEXT,
  visi TEXT,
  misi JSONB DEFAULT '[]'::jsonb,
  alamat_kantor TEXT,
  telepon TEXT,
  email TEXT,
  jam_operasional JSONB,
  instagram TEXT,
  facebook TEXT,
  whatsapp TEXT,
  foto_hero_url TEXT,
  foto_sejarah_url TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  peta_embed_url TEXT
);

-- Pastikan selalu ada row id=1 (upsert no-op kalau row sudah ada)
INSERT INTO desa_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Migrasi aman untuk database lama: tambah kolom peta_embed_url jika belum ada
ALTER TABLE desa_info ADD COLUMN IF NOT EXISTS peta_embed_url TEXT;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS pada semua tabel
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE desa_info ENABLE ROW LEVEL SECURITY;

-- === Policy: Public READ (anon key) ===
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_select_produk') THEN
    CREATE POLICY "public_select_produk" ON produk FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_select_galeri') THEN
    CREATE POLICY "public_select_galeri" ON galeri FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_select_desa_info') THEN
    CREATE POLICY "public_select_desa_info" ON desa_info FOR SELECT USING (true);
  END IF;
END $$;

-- === Policy: INSERT/UPDATE/DELETE hanya untuk service_role ===
-- Hanya request yang menggunakan service_role key (server-side API routes)
-- yang bisa menulis data. Client-side dengan anon key TIDAK bisa tulis.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_write_produk') THEN
    CREATE POLICY "admin_write_produk"
      ON produk FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_write_galeri') THEN
    CREATE POLICY "admin_write_galeri"
      ON galeri FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_write_desa_info') THEN
    CREATE POLICY "admin_write_desa_info"
      ON desa_info FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
