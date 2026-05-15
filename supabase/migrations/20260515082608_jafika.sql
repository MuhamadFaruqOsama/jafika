create table if not exists public.users (
  id bigint generated always as identity primary key,
  username varchar(255) not null,
  email varchar(255) not null unique,
  email_verified_at timestamptz null,
  password varchar(255) null,
  remember_token varchar(100) null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_username_idx
  on public.users (username);

create index if not exists users_created_at_idx
  on public.users (created_at);
