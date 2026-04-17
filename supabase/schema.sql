create extension if not exists pgcrypto;

create table if not exists public.weather_snapshots (
  city text primary key,
  latitude numeric(8, 5) not null,
  longitude numeric(8, 5) not null,
  temperature numeric(5, 2) not null,
  windspeed numeric(5, 2) not null,
  weather_code integer not null,
  observed_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.weather_snapshots enable row level security;

drop policy if exists "weather_snapshots_public_read" on public.weather_snapshots;
create policy "weather_snapshots_public_read"
on public.weather_snapshots
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select on public.weather_snapshots to anon, authenticated;

alter publication supabase_realtime add table public.weather_snapshots;
