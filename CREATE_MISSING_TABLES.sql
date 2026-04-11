-- ============================================
-- Create Missing Tables for PowerXchange
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_book ON wishlist(book_id);

-- ============================================
-- 2. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_book ON transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================
-- 3. DISABLE RLS (for development)
-- ============================================
ALTER TABLE wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. TRIGGER for transactions updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFY TABLES CREATED
-- ============================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('wishlist', 'transactions', 'profiles', 'books')
ORDER BY table_name;
