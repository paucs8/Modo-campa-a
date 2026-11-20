-- Duelos 1 contra 1: una semana, quien más XP o más días entrena, con monedas en juego.
-- Pega esto en Supabase → SQL Editor → New query → Run.

create table if not exists public.duels (
  id bigint generated always as identity primary key,
  challenger uuid not null default auth.uid() references auth.users (id) on delete cascade,
  opponent uuid not null references auth.users (id) on delete cascade,
  challenger_name text not null default '',
  opponent_name text not null default '',
  metric text not null default 'xp' check (metric in ('xp', 'entrenos')),
  stake int not null default 0 check (stake between 0 and 1000),
  status text not null default 'pending' check (status in ('pending', 'active', 'declined', 'cancelled', 'finished')),
  start_day date,
  end_day date,
  challenger_score int not null default 0,
  opponent_score int not null default 0,
  created_at timestamptz not null default now(),
  check (challenger <> opponent)
);

alter table public.duels enable row level security;
drop policy if exists "ver mis duelos" on public.duels;
drop policy if exists "retar" on public.duels;
drop policy if exists "actualizar mis duelos" on public.duels;
create policy "ver mis duelos" on public.duels for select to authenticated using (auth.uid() in (challenger, opponent));
create policy "retar" on public.duels for insert to authenticated with check (auth.uid() = challenger and status = 'pending');
create policy "actualizar mis duelos" on public.duels for update to authenticated using (auth.uid() in (challenger, opponent)) with check (auth.uid() in (challenger, opponent));

do $$ begin alter publication supabase_realtime add table public.duels; exception when duplicate_object then null; end $$;
