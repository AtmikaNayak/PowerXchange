-- ============================================
-- COMPLETE FIX FOR BOOKS TABLE
-- COPY AND RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- ============================================

-- Add ALL missing columns to the books table
ALTER TABLE books
ADD COLUMN IF NOT EXISTS seller_id UUID,
ADD COLUMN IF NOT EXISTS seller_name TEXT,
ADD COLUMN IF NOT EXISTS seller_phone TEXT,
ADD COLUMN IF NOT EXISTS seller_email TEXT,
ADD COLUMN IF NOT EXISTS seller_address TEXT,
ADD COLUMN IF NOT EXISTS seller_city TEXT,
ADD COLUMN IF NOT EXISTS seller_pincode TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS genre TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Create all indexes
CREATE INDEX IF NOT EXISTS idx_books_seller ON books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_price ON books(price);
CREATE INDEX IF NOT EXISTS idx_books_image ON books(image_url);
CREATE INDEX IF NOT EXISTS idx_books_seller_phone ON books(seller_phone);
CREATE INDEX IF NOT EXISTS idx_books_seller_city ON books(seller_city);
CREATE INDEX IF NOT EXISTS idx_books_approved ON books(is_approved);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- Verify the structure - this will show all columns
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;
