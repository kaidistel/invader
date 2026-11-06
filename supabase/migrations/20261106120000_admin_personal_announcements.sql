-- NÄHEN: personal announcement preferences and messages (applied in Supabase).
create table if not exists public.admin_message_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.admin_message_preferences enable row level security;
create policy "read_self" on public.admin_message_preferences for select to authenticated
  using (user_id = (select auth.uid()));
create policy "create_self" on public.admin_message_preferences for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "update_self" on public.admin_message_preferences for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant select, insert, update on public.admin_message_preferences to authenticated;

create table if not exists public.admin_messages (
 id uuid primary key default gen_random_uuid(),
 recipient_id uuid not null references auth.users(id) on delete cascade,
 sender_id uuid not null references auth.users(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 72),
 body text not null check (char_length(body) between 1 and 240),
 push_status text not null default 'pending' check (push_status in ('pending','sent','no_subscription','not_configured','failed')),
 created_at timestamptz not null default now()
);
create index if not exists admin_messages_recipient_time_idx on public.admin_messages(recipient_id,created_at desc);
create index if not exists admin_messages_sender_time_idx on public.admin_messages(sender_id,created_at desc);
alter table public.admin_messages enable row level security;
create policy "recipient_reads_own" on public.admin_messages for select to authenticated using (recipient_id = (select auth.uid()));
grant select on public.admin_messages to authenticated;
