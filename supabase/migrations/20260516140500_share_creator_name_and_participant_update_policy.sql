alter table public.question
  add column if not exists creator_name varchar(255) not null default 'Pengguna';

update public.question q
set creator_name = coalesce(
  nullif(trim((au.raw_user_meta_data ->> 'nickname')), ''),
  nullif(trim((au.raw_user_meta_data ->> 'username')), ''),
  nullif(trim(au.email), ''),
  'Pengguna'
)
from auth.users au
where au.id = q.user_id
  and (q.creator_name is null or trim(q.creator_name) = '' or q.creator_name = 'Pengguna');

alter table public.question enable row level security;
alter table public.question_participant enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'question'
      and policyname = 'question_select_public_access'
  ) then
    create policy question_select_public_access
      on public.question
      for select
      to anon, authenticated
      using (public_access = true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'question_participant'
      and policyname = 'question_participant_insert_public'
  ) then
    create policy question_participant_insert_public
      on public.question_participant
      for insert
      to anon, authenticated
      with check (
        exists (
          select 1
          from public.question q
          where q.id = question_participant.question_id
            and q.public_access = true
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'question_participant'
      and policyname = 'question_participant_update_finish_public'
  ) then
    create policy question_participant_update_finish_public
      on public.question_participant
      for update
      to anon, authenticated
      using (
        exists (
          select 1
          from public.question q
          where q.id = question_participant.question_id
            and q.public_access = true
        )
      )
      with check (
        exists (
          select 1
          from public.question q
          where q.id = question_participant.question_id
            and q.public_access = true
        )
        and start is not null
      );
  end if;
end $$;
