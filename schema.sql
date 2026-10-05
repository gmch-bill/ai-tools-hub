create extension if not exists pgcrypto;

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  description text default '',
  image_url text default '',
  destination_url text default '',
  button_text text default 'Check Tool →',
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ad_type text not null default 'Banner',
  placement text not null default 'top',
  ad_code text not null,
  show_mobile boolean default true,
  show_desktop boolean default true,
  enabled boolean default true,
  created_at timestamptz default now()
);

alter table public.tools enable row level security;
alter table public.ads enable row level security;

-- Public visitors can read published tools and enabled ads.
create policy "public read published tools" on public.tools
for select using (published = true);

create policy "public read enabled ads" on public.ads
for select using (enabled = true);

-- Logged-in admins can manage rows. Create only your admin users in Supabase Auth.
create policy "authenticated manage tools" on public.tools
for all to authenticated using (true) with check (true);

create policy "authenticated manage ads" on public.ads
for all to authenticated using (true) with check (true);
