-- Fix infinite recursion in profiles RLS policies introduced in 003.
--
-- The "profiles: admin read all" policy queried the profiles table itself,
-- causing Postgres to recurse infinitely when evaluating any policy that
-- referenced profiles. A SECURITY DEFINER function bypasses RLS and breaks
-- the cycle.

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Replace the recursive admin-check policy on profiles
drop policy if exists "profiles: admin read all" on public.profiles;

create policy "profiles: admin read all"
  on public.profiles for select
  using (public.is_admin());

-- Replace the recursive admin-check in the observations policy
drop policy if exists "observations: self or admin read" on public.observations;

create policy "observations: self or admin read"
  on public.observations for select
  using (
    auth.uid() = user_id
    or public.is_admin()
  );
