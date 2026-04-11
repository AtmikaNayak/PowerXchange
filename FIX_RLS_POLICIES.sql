-- ============================================
-- PowerXchange - Database Setup & RLS Policies
-- Run this ENTIRE file in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text,
  usn text,
  college text,
  id_card_url text,
  role text default 'user',      -- 'user' | 'admin'
  status text default 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason text,
  created_at timestamp default now(),
  approved_at timestamp
);

-- ============================================
-- 2. BOOKS TABLE
-- ============================================
create table if not exists books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  genre text,
  description text,
  cover_url text,
  price_per_day numeric default 10,
  total_copies int default 1,
  available_copies int default 1,
  times_rented int default 0,
  condition text default 'Good',
  created_at timestamp default now()
);

-- ============================================
-- 3. RENTALS TABLE
-- ============================================
create table if not exists rentals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  book_id uuid references books(id),
  rented_at timestamp default now(),
  due_date timestamp,
  returned_at timestamp,
  status text default 'active',
  total_cost numeric
);

-- ============================================
-- 4. STORAGE BUCKET for ID cards
-- ============================================
insert into storage.buckets (id, name, public)
values ('id-cards', 'id-cards', false)
on conflict do nothing;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) - DISABLED
-- ============================================
-- Disabling RLS to allow full access during development
-- Enable and configure policies for production

alter table profiles disable row level security;
alter table books disable row level security;
alter table rentals disable row level security;

-- ============================================
-- 6. TRIGGER: Auto-create profile on signup
-- ============================================
-- This ensures a profile is always created when a user signs up

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, college, usn, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'college', ''),
    coalesce(new.raw_user_meta_data->>'usn', ''),
    'user',
    'pending'
  )
  on conflict (id) do update set
    full_name = coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    email = new.email,
    college = coalesce(new.raw_user_meta_data->>'college', ''),
    usn = coalesce(new.raw_user_meta_data->>'usn', '');
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists and create new one
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- 7. MAKE YOURSELF ADMIN
-- ============================================
update profiles
set role = 'admin', status = 'approved'
where email IN (
  'atmikanayak021206@gmail.com',
  'jatharva1701@gmail.com',
  'aakankshakpoojari265@gmail.com'
);

insert into profiles (id, email, role, status)
values (
  (select id from auth.users where email = 'nnm24cs058@nmamit.in'),
  'nnm24cs058@nmamit.in',
  'admin',
  'approved'
)
on conflict (id) do update
  set role = 'admin', status = 'approved';

-- ============================================
-- 8. VERIFY: Check admin status
-- ============================================
select email, role, status from profiles
where email IN (
  'atmikanayak021206@gmail.com',
  'jatharva1701@gmail.com',
  'aakankshakpoojari265@gmail.com',
  'nnm24cs058@nmamit.in'
);
