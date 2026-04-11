-- PowerXchange Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database tables

-- ============================================
-- 1. PROFILES TABLE (extends Supabase auth)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  college TEXT,
  location TEXT,
  bio TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_college ON profiles(college);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified);

-- ============================================
-- 2. BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_name TEXT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  category TEXT,
  condition TEXT,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for books
CREATE INDEX IF NOT EXISTS idx_books_seller ON books(seller_id);
CREATE INDEX IF NOT EXISTS idx_books_approved ON books(is_approved);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- ============================================
-- 3. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_book ON transactions(book_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ============================================
-- 4. ADMIN_ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  permissions JSONB DEFAULT '{"users": true, "books": true, "transactions": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin lookup
CREATE INDEX IF NOT EXISTS idx_admin_user_id ON admin_roles(user_id);

-- ============================================
-- 5. WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Index for wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);

-- ============================================
-- 6. REVIEWS TABLE (optional, for future)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_book ON reviews(book_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(target_user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to books
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to transactions
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Books policies
CREATE POLICY "Approved books are viewable by everyone"
  ON books FOR SELECT
  USING (is_approved = true OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own books"
  ON books FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own books"
  ON books FOR DELETE
  USING (auth.uid() = seller_id);

-- Admin policies - allow admins full access
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all books"
  ON books FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist"
  ON wishlist FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- INSERT ADMIN USER
-- ============================================
-- IMPORTANT: After creating a user account via signup,
-- run this command to make them an admin:
--
-- INSERT INTO admin_roles (user_id, name, email)
-- SELECT id, name, email FROM profiles
-- WHERE email = 'your-admin-email@college.edu';
--
-- Or directly with the user's UUID:
-- INSERT INTO admin_roles (user_id, name, email)
-- VALUES ('user-uuid-here', 'Admin Name', 'admin@college.edu');

-- ============================================
-- HELPER FUNCTION: Create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, college)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'college', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();




  -- ============================================
  -- 3. RECREATE YOUR ORIGINAL PROFILES TABLE
  -- ============================================
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    usn TEXT,
    college TEXT,
    id_card_url TEXT,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    approved_at TIMESTAMP
  );

  -- ============================================
  -- 4. DISABLE RLS (like your original working setup)
  -- ============================================
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

  -- ============================================
  -- 5. RECREATE BOOKS TABLE (your original structure)
  -- ============================================
  CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    description TEXT,
    cover_url TEXT,
    price_per_day NUMERIC DEFAULT 10,
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    times_rented INT DEFAULT 0,
    condition TEXT DEFAULT 'Good',
    created_at TIMESTAMP DEFAULT NOW()
  );

  ALTER TABLE books DISABLE ROW LEVEL SECURITY;

  -- ============================================
  -- 6. RECREATE RENTALS TABLE
  -- ============================================
  CREATE TABLE IF NOT EXISTS rentals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    book_id UUID REFERENCES books(id),
    rented_at TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,
    returned_at TIMESTAMP,
    status TEXT DEFAULT 'active',
    total_cost NUMERIC
  );

  ALTER TABLE rentals DISABLE ROW LEVEL SECURITY;

  -- ============================================
  -- 7. RE-APPLY YOUR ADMIN USERS
  -- ============================================
  UPDATE profiles SET role = 'admin', status = 'approved'
  WHERE email IN (
    'jatharva1701@gmail.com'
  );

select role,email, full_name from profiles  