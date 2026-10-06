create table if not exists public.live_wait_cache (
  park_slug text primary key,
  payload jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table public.live_wait_cache enable row level security;

revoke all on table public.live_wait_cache from anon, authenticated;
