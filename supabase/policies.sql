-- 0. Enable UUID extension (Required for uuid_generate_v4)
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table (Public User Data)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text, -- Added for persistent DP
  subscription_tier text default 'free',
  -- Onboarding Data
  available_hours_per_week integer,
  goals text[],
  interests text[],
  skills text[],
  resources text[],
  location_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

-- 2. QUESTS Table
create table if not exists public.quests (
    id text not null primary key, -- Text because we use specialized IDs sometimes or UUIDs
    user_id uuid references auth.users not null,
    status text default 'suggested',
    custom_data jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    started_at timestamp with time zone,
    completed_at timestamp with time zone
);

alter table public.quests enable row level security;

create policy "Users can view own quests" 
on public.quests for select 
using ( auth.uid() = user_id );

create policy "Users can insert own quests" 
on public.quests for insert 
with check ( auth.uid() = user_id );

create policy "Users can update own quests" 
on public.quests for update 
using ( auth.uid() = user_id );

create policy "Users can delete own quests" 
on public.quests for delete 
using ( auth.uid() = user_id );

-- 3. AD_STATS Table
create table if not exists public.ad_stats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    ad_type text not null,
    viewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ad_stats enable row level security;

create policy "Users can log ad views" 
on public.ad_stats for insert 
with check ( auth.uid() = user_id );

-- 4. AD_REWARDS Table
create table if not exists public.ad_rewards (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    reward_type text not null,
    earned_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ad_rewards enable row level security;

-- 5. STORAGE POLICIES (Avatars)
-- Note: You must create the 'avatars' bucket in the dashboard first.
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar"
  on storage.objects for update
  using ( bucket_id = 'avatars' );

-- 6. RPC Helpers (Optional but good for full cleaning)
-- Note: Usually managed via Supabase extensions or dashboard

