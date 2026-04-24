-- Observations log (run in Supabase SQL editor or via CLI) --

create table if not exists public.observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  object_name text not null,
  object_type text not null default '',
  observed_at date not null,
  location text not null default '',
  telescope text not null default '',
  notes text not null default '',
  sketch_path text,
  created_at timestamptz not null default now()
);

create index if not exists observations_user_id_observed_at_idx
  on public.observations (user_id, observed_at desc);

alter table public.observations enable row level security;

create policy "Users select own observations"
  on public.observations for select
  using (auth.uid() = user_id);

create policy "Users insert own observations"
  on public.observations for insert
  with check (auth.uid() = user_id);

create policy "Users update own observations"
  on public.observations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users delete own observations"
  on public.observations for delete
  using (auth.uid() = user_id);

-- Storage for optional field sketches (path stored on observations.sketch_path)

insert into storage.buckets (id, name, public)
values ('observation-sketches', 'observation-sketches', true)
on conflict (id) do nothing;

create policy "Users upload own sketches"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'observation-sketches'
    and (storage.foldername (name))[1] = auth.uid()::text
  );

create policy "Users read own sketches"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'observation-sketches'
    and (storage.foldername (name))[1] = auth.uid()::text
  );
