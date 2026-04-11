-- Add seller contact information columns to books table
-- Run this in Supabase SQL Editor

ALTER TABLE books
ADD COLUMN IF NOT EXISTS seller_phone TEXT,
ADD COLUMN IF NOT EXISTS seller_email TEXT,
ADD COLUMN IF NOT EXISTS seller_address TEXT,
ADD COLUMN IF NOT EXISTS seller_city TEXT,
ADD COLUMN IF NOT EXISTS seller_pincode TEXT;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_books_seller_phone ON books(seller_phone);
CREATE INDEX IF NOT EXISTS idx_books_seller_city ON books(seller_city);

-- Comment to document the columns
COMMENT ON COLUMN books.seller_phone IS 'Seller contact phone number';
COMMENT ON COLUMN books.seller_email IS 'Seller contact email';
COMMENT ON COLUMN books.seller_address IS 'Seller street address';
COMMENT ON COLUMN books.seller_city IS 'Seller city';
COMMENT ON COLUMN books.seller_pincode IS 'Seller PIN code';
