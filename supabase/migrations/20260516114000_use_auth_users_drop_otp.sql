-- Switch question ownership to Supabase auth.users (UUID)
-- and remove legacy public.users + OTP tables/routes dependency.

drop policy if exists question_select_own on public.question;
drop policy if exists question_insert_own on public.question;
drop policy if exists question_update_own on public.question;
drop policy if exists question_delete_own on public.question;

do $$
declare
  question_user_id_type text;
begin
  select c.data_type
    into question_user_id_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'question'
    and c.column_name = 'user_id';

  if question_user_id_type = 'bigint' then
    alter table public.question
      add column if not exists user_id_new uuid;

    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = 'users'
    ) then
      update public.question q
      set user_id_new = au.id
      from public.users pu
      join auth.users au
        on lower(au.email) = lower(pu.email)
      where q.user_id = pu.id;
    end if;

    -- For dev migration safety: remove rows that cannot be mapped to auth.users.
    delete from public.question
    where user_id_new is null;

    alter table public.question
      drop constraint if exists question_user_id_fkey;

    alter table public.question
      drop column user_id;

    alter table public.question
      rename column user_id_new to user_id;

    alter table public.question
      alter column user_id set not null;

    alter table public.question
      add constraint question_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end $$;

alter table public.question enable row level security;

create policy question_select_own
  on public.question
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy question_insert_own
  on public.question
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy question_update_own
  on public.question
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy question_delete_own
  on public.question
  for delete
  to authenticated
  using (auth.uid() = user_id);

create index if not exists question_user_id_idx
  on public.question (user_id);

drop table if exists public.user_otps;
drop table if exists public.users;
