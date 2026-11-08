-- Darse caña entre amigos y resultados de la semana pasada.
-- Pega esto en Supabase → SQL Editor → New query → Run.

-- Resultado de la semana anterior de cada jugador (para el cierre del lunes)
alter table public.profiles add column if not exists prev_week text;
alter table public.profiles add column if not exists prev_week_xp int not null default 0;

-- Avisos de "¡vamos!" de un jugador a otro
create table if not exists public.nudges (
  id bigint generated always as identity primary key,
  from_id uuid not null references auth.users (id) on delete cascade,
  to_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  seen boolean not null default false
);
alter table public.nudges enable row level security;
create policy "mandar caña" on public.nudges for insert to authenticated with check (auth.uid() = from_id and from_id <> to_id);
create policy "ver mis cañas" on public.nudges for select to authenticated using (auth.uid() = to_id or auth.uid() = from_id);
create policy "marcar como vista" on public.nudges for update to authenticated using (auth.uid() = to_id) with check (auth.uid() = to_id);
alter publication supabase_realtime add table public.nudges;
