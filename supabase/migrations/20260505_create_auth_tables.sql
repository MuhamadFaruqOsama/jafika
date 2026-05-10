create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  email text not null unique,
  email_verified_at timestamptz,
  password text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_otps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  otp text not null check (otp ~ '^[0-9]{6}$'),
  expired_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on public.users (email);
create index if not exists idx_user_otps_user_id on public.user_otps (user_id);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists user_otps_set_updated_at on public.user_otps;
create trigger user_otps_set_updated_at
before update on public.user_otps
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.user_otps enable row level security;

drop policy if exists users_insert_anon on public.users;
create policy users_insert_anon
on public.users
for insert
to anon, authenticated
with check (true);

drop policy if exists users_select_anon on public.users;
create policy users_select_anon
on public.users
for select
to anon, authenticated
using (true);

drop policy if exists users_update_anon on public.users;
create policy users_update_anon
on public.users
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists users_delete_anon on public.users;
create policy users_delete_anon
on public.users
for delete
to anon, authenticated
using (true);

drop policy if exists user_otps_insert_anon on public.user_otps;
create policy user_otps_insert_anon
on public.user_otps
for insert
to anon, authenticated
with check (true);

drop policy if exists user_otps_select_anon on public.user_otps;
create policy user_otps_select_anon
on public.user_otps
for select
to anon, authenticated
using (true);

drop policy if exists user_otps_delete_anon on public.user_otps;
create policy user_otps_delete_anon
on public.user_otps
for delete
to anon, authenticated
using (true);
