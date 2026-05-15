create table if not exists public.user_otps (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  otp_hash text not null,
  expired_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists user_otps_user_id_created_at_idx
  on public.user_otps (user_id, created_at desc);

create index if not exists user_otps_user_id_otp_hash_idx
  on public.user_otps (user_id, otp_hash);
