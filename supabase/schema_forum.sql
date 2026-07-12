-- ============================================================================
-- DATABASE SCHEMA — FORUM DISKUSI (Desa Sejahtera)
-- ============================================================================
-- CARA MENJALANKAN:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Copy-paste SELURUH isi file ini
--   3. Klik "Run" / tekan Ctrl+Enter
--   4. Tunggu sukses (akan muncul "Success. No rows returned")
-- ============================================================================

-- === TABEL: forum_topik ===
CREATE TABLE IF NOT EXISTS forum_topik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  kategori TEXT DEFAULT 'Diskusi',  -- 'Pengumuman' | 'Aspirasi' | 'Diskusi'
  isi TEXT NOT NULL,
  nama_penulis TEXT NOT NULL,
  avatar_url TEXT,                  -- nullable — avatar tidak wajib
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === TABEL: forum_komentar ===
CREATE TABLE IF NOT EXISTS forum_komentar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topik_id UUID NOT NULL REFERENCES forum_topik(id) ON DELETE CASCADE,
  nama_penulis TEXT NOT NULL,
  isi TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk lookup komentar per topik (dipakai di API GET topik detail)
CREATE INDEX IF NOT EXISTS idx_forum_komentar_topik_id
  ON forum_komentar(topik_id);

-- Index untuk sorting topik by created_at (list forum)
CREATE INDEX IF NOT EXISTS idx_forum_topik_created_at
  ON forum_topik(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE forum_topik ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_komentar ENABLE ROW LEVEL SECURITY;

-- === Policy: Public READ (anon key & public access) ===
-- Semua topik dan komentar bisa dibaca oleh siapa saja.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_select_forum_topik') THEN
    CREATE POLICY "public_select_forum_topik"
      ON forum_topik FOR SELECT
      USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_select_forum_komentar') THEN
    CREATE POLICY "public_select_forum_komentar"
      ON forum_komentar FOR SELECT
      USING (true);
  END IF;
END $$;

-- === Policy: Public INSERT (anon key bisa insert — forum untuk warga umum) ===
-- Siapa saja bisa buat topik baru dan komentar baru TANPA login.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_insert_forum_topik') THEN
    CREATE POLICY "public_insert_forum_topik"
      ON forum_topik FOR INSERT
      WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'public_insert_forum_komentar') THEN
    CREATE POLICY "public_insert_forum_komentar"
      ON forum_komentar FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- === Policy: Public TIDAK bisa UPDATE/DELETE ===
-- Diskusi tidak boleh diedit/hapus sembarangan.
-- Admin moderasi via service_role (lihat policy admin_write di bawah).

-- === Policy: Admin (service_role) bisa DELETE untuk moderasi ===
-- Hanya request yang pakai service_role key (server-side API routes admin)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_delete_forum_topik') THEN
    CREATE POLICY "admin_delete_forum_topik"
      ON forum_topik FOR DELETE
      USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_delete_forum_komentar') THEN
    CREATE POLICY "admin_delete_forum_komentar"
      ON forum_komentar FOR DELETE
      USING (auth.role() = 'service_role');
  END IF;
END $$;
