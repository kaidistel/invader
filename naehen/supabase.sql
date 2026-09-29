-- NÄHEN MVP · Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Parkfan',
  created_at timestamptz not null default now()
);

create table if not exists public.park_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  park_slug text not null default 'phantasialand',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.queue_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  park_day_id uuid references public.park_days(id) on delete cascade,
  ride_id text not null,
  ride_name text not null,
  queue_type text not null check (queue_type in ('regular','single')),
  posted_wait integer,
  started_at timestamptz not null,
  ended_at timestamptz,
  status text not null default 'waiting' check (status in ('waiting','ridden','aborted')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  ride_id text not null,
  wait_limit integer,
  notify_drop boolean not null default true,
  notify_reopen boolean not null default true,
  primary key (user_id, ride_id)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.park_days enable row level security;
alter table public.queue_sessions enable row level security;
alter table public.favorites enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "profiles own" on public.profiles for all using (auth.uid()=id) with check (auth.uid()=id);
create policy "park days own" on public.park_days for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "queue sessions own" on public.queue_sessions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "favorites own" on public.favorites for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "push subscriptions own" on public.push_subscriptions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,username)
  values(new.id,coalesce(new.raw_user_meta_data->>'username','Parkfan'));
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();