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

create table if not exists public.question (
  id bigint generated always as identity primary key,
  uuid varchar(255) not null unique,
  user_id bigint not null references public.users(id) on delete cascade,
  title varchar(255) not null,
  kpk_mode boolean not null default true,
  fpb_mode boolean not null default true,
  description text not null,
  find_number jsonb not null default '[]'::jsonb,
  thumbnail varchar(255) null,
  public_access boolean not null default true,
  "3d_assistant" boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists question_user_id_idx
  on public.question (user_id);

create table if not exists public.question_participant (
  id bigint generated always as identity primary key,
  question_id bigint not null references public.question(id) on delete cascade,
  name varchar(255) not null,
  start timestamptz null,
  finish timestamptz null
);

create index if not exists question_participant_question_id_idx
  on public.question_participant (question_id);
