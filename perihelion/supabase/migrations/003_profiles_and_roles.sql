-- Profiles table with role-based access control --

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'user' check (role in ('user', 'admin')),
  handle      text unique,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: self read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: admin read all"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row (role = 'user') when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profiles for any existing users who signed up before this migration
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Replace the user-only SELECT policy with one that also allows admins
drop policy if exists "Users select own observations" on public.observations;

create policy "observations: self or admin read"
  on public.observations for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
