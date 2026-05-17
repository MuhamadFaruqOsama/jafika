alter table public.question
  add column if not exists material varchar(255) null;
