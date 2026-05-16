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
      and policyname = 'question_participant_select_owner'
  ) then
    create policy question_participant_select_owner
      on public.question_participant
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.question q
          where q.id = question_participant.question_id
            and q.user_id::text = auth.uid()::text
        )
      );
  end if;
end $$;
