-- Setup Supabase Storage for Book Images
-- Run this in Supabase SQL Editor

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-images', 'book-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all files in the bucket
CREATE POLICY "Public images are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-images');

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload book images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'book-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'book-images'
  AND auth.uid() = owner
);

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'book-images'
  AND auth.uid() = owner
);
