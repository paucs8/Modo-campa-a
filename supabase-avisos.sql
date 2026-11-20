-- Avisos al móvil: dónde mandar los avisos de cada usuario y qué quiere recibir.
-- Pega esto en Supabase → SQL Editor → New query → Run.

create table if not exists public.push_subs (
  endpoint text primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  p256dh text not null,
  auth text not null,
  hour int not null default 20 check (hour between 0 and 23),
  hour2 int default 13 check (hour2 between 0 and 23),
  kinds text[] not null default '{reminder,nudge,duel,invite,react,overtake}',
  rivals uuid[] not null default '{}',
  done_day date,
  updated_at timestamptz not null default now()
);
create index if not exists push_subs_user_idx on public.push_subs (user_id);
create index if not exists push_subs_hour_idx on public.push_subs (hour);

alter table public.push_subs enable row level security;
drop policy if exists "mis avisos" on public.push_subs;
create policy "mis avisos" on public.push_subs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Registro para limitar avisos (solo lo usa el servidor)
create table if not exists public.push_log (
  id bigint generated always as identity primary key,
  from_id uuid not null,
  to_id uuid not null,
  kind text not null,
  created_at timestamptz not null default now()
);
create index if not exists push_log_from_idx on public.push_log (from_id, created_at);
alter table public.push_log enable row level security;

-- Segundo recordatorio del día (por si ya habías creado la tabla antes)
alter table public.push_subs add column if not exists hour2 int default 13 check (hour2 between 0 and 23);

-- Recordatorios de «Cada día» (pastilla, creatina…): nombre, hora y si ya está hecho hoy
alter table public.push_subs add column if not exists items jsonb not null default '[]';
