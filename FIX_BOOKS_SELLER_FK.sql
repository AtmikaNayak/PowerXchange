-- ============================================
-- FIX BOOKS TABLE - Add seller_id and all required columns
-- RUN THIS IN SUPABASE SQL EDITOR
-- ============================================

-- First check what columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'books'
ORDER BY ordinal_position;

-- Add seller_id column if it doesn't exist
ALTER TABLE books
ADD COLUMN IF NOT EXISTS seller_id UUID;

-- Add all other missing columns
ALTER TABLE books
ADD COLUMN IF NOT EXISTS seller_name TEXT,
ADD COLUMN IF NOT EXISTS seller_phone TEXT,
ADD COLUMN IF NOT EXISTS seller_email TEXT,
ADD COLUMN IF NOT EXISTS seller_address TEXT,
ADD COLUMN IF NOT EXISTS seller_city TEXT,
ADD COLUMN IF NOT EXISTS seller_pincode TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_books_seller ON books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_approved ON books(is_approved);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);

-- Update existing books to have proper seller_id from profiles
-- This matches books to users based on email or creates a default
UPDATE books b
SET seller_id = (
  SELECT id FROM profiles p
  WHERE p.email = b.seller_email
  LIMIT 1
)
WHERE b.seller_id IS NULL AND b.seller_email IS NOT NULL;

-- Verify the data
SELECT b.id, b.title, b.author, b.seller_id, b.seller_name, b.is_approved, p.full_name, p.email
FROM books b
LEFT JOIN profiles p ON b.seller_id = p.id
ORDER BY b.created_at DESC;
