-- NÄHEN MVP · Supabase schema
-- Safe to run more than once in the Supabase SQL editor.
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
  ended_at timestamptz,
  created_at timestamptz not null default now()
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
  wait_seconds integer,
  status text not null default 'waiting' check (status in ('waiting','ridden','aborted')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  ride_id text not null,
  wait_limit integer,
  notify_below boolean not null default true,
  notify_drop boolean not null default true,
  notify_reopen boolean not null default true,
  notify_sr boolean not null default false,
  drop_minutes integer not null default 15,
  updated_at timestamptz not null default now(),
  primary key (user_id, ride_id)
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sr_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  queue_session_id uuid references public.queue_sessions(id) on delete set null,
  ride_id text not null,
  wait_seconds integer not null check (wait_seconds >= 0),
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Current server-side ride state for future push evaluation.
create table if not exists public.live_ride_state (
  ride_id text primary key,
  ride_name text not null,
  wait_time integer not null default 0,
  is_open boolean not null default false,
  source_updated_at timestamptz,
  synced_at timestamptz not null default now()
);

create table if not exists public.push_event_log (
  event_key text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  ride_id text,
  created_at timestamptz not null default now()
);

create index if not exists queue_sessions_user_started_idx on public.queue_sessions(user_id, started_at desc);
create index if not exists sr_reports_ride_measured_idx on public.sr_reports(ride_id, measured_at desc);
create index if not exists favorites_user_idx on public.favorites(user_id);
create index if not exists park_days_user_id_idx on public.park_days(user_id);
create index if not exists push_event_log_user_id_idx on public.push_event_log(user_id);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions(user_id);
create index if not exists queue_sessions_park_day_id_idx on public.queue_sessions(park_day_id);
create index if not exists sr_reports_queue_session_id_idx on public.sr_reports(queue_session_id);
create index if not exists sr_reports_user_id_idx on public.sr_reports(user_id);

alter table public.profiles enable row level security;
alter table public.park_days enable row level security;
alter table public.queue_sessions enable row level security;
alter table public.favorites enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.sr_reports enable row level security;
alter table public.live_ride_state enable row level security;
alter table public.push_event_log enable row level security;

drop policy if exists "profiles own" on public.profiles;
create policy "profiles own" on public.profiles for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "park days own" on public.park_days;
create policy "park days own" on public.park_days for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "queue sessions own" on public.queue_sessions;
create policy "queue sessions own" on public.queue_sessions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "favorites own" on public.favorites;
create policy "favorites own" on public.favorites for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "push subscriptions own" on public.push_subscriptions;
create policy "push subscriptions own" on public.push_subscriptions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Community SR data is deliberately anonymous in the UI:
-- signed-in users may read wait durations/timestamps; users only write/delete their own rows.
drop policy if exists "sr reports authenticated read" on public.sr_reports;
create policy "sr reports authenticated read" on public.sr_reports for select to authenticated using (true);
drop policy if exists "sr reports own insert" on public.sr_reports;
create policy "sr reports own insert" on public.sr_reports for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists "sr reports own delete" on public.sr_reports;
create policy "sr reports own delete" on public.sr_reports for delete to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "live state authenticated read" on public.live_ride_state;
create policy "live state authenticated read" on public.live_ride_state for select to authenticated using (true);

revoke all on public.push_event_log from anon, authenticated;

drop policy if exists "push event log no client access" on public.push_event_log;
create policy "push event log no client access" on public.push_event_log
for all to authenticated
using (false)
with check (false);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,username)
  values(new.id,coalesce(nullif(new.raw_user_meta_data->>'username',''),'Parkfan'))
  on conflict (id) do nothing;
  return new;
end; $;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
