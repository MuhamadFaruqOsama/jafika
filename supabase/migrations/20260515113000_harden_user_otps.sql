-- Clear previous OTP rows because legacy rows stored plain code (not hash)
delete from public.user_otps;

alter table public.user_otps
  add column if not exists otp_hash text;

alter table public.user_otps
  drop constraint if exists user_otps_otp_length_check;

drop index if exists user_otps_user_id_otp_idx;

create index if not exists user_otps_user_id_otp_hash_idx
  on public.user_otps (user_id, otp_hash);

alter table public.user_otps
  drop column if exists otp;

alter table public.user_otps
  alter column otp_hash set not null;

