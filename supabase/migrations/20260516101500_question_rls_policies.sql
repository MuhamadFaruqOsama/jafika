alter table public.users enable row level security;
alter table public.question enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_select_own_email'
  ) then
    create policy users_select_own_email
      on public.users
      for select
      to authenticated
      using (lower(email) = lower(auth.jwt()->>'email'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_insert_own_email'
  ) then
    create policy users_insert_own_email
      on public.users
      for insert
      to authenticated
      with check (lower(email) = lower(auth.jwt()->>'email'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'users_update_own_email'
  ) then
    create policy users_update_own_email
      on public.users
      for update
      to authenticated
      using (lower(email) = lower(auth.jwt()->>'email'))
      with check (lower(email) = lower(auth.jwt()->>'email'));
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'question'
      and policyname = 'question_select_own'
  ) then
    create policy question_select_own
      on public.question
      for select
      to authenticated
      using (
        exists (
          select 1
          from public.users
          where users.id = question.user_id
            and lower(users.email) = lower(auth.jwt()->>'email')
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
      and tablename = 'question'
      and policyname = 'question_insert_own'
  ) then
    create policy question_insert_own
      on public.question
      for insert
      to authenticated
      with check (
        exists (
          select 1
          from public.users
          where users.id = question.user_id
            and lower(users.email) = lower(auth.jwt()->>'email')
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
      and tablename = 'question'
      and policyname = 'question_update_own'
  ) then
    create policy question_update_own
      on public.question
      for update
      to authenticated
      using (
        exists (
          select 1
          from public.users
          where users.id = question.user_id
            and lower(users.email) = lower(auth.jwt()->>'email')
        )
      )
      with check (
        exists (
          select 1
          from public.users
          where users.id = question.user_id
            and lower(users.email) = lower(auth.jwt()->>'email')
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
      and tablename = 'question'
      and policyname = 'question_delete_own'
  ) then
    create policy question_delete_own
      on public.question
      for delete
      to authenticated
      using (
        exists (
          select 1
          from public.users
          where users.id = question.user_id
            and lower(users.email) = lower(auth.jwt()->>'email')
        )
      );
  end if;
end $$;

