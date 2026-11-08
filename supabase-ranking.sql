-- Ranking entre amigos. Pega esto en Supabase → SQL Editor → New query → Run.
-- Cada persona tiene un perfil público con lo justo para el ranking (nada de peso, rutinas ni misiones).
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 24),
  color text not null default 'lilac',
  level int not null default 1,
  xp int not null default 0,
  week text,
  week_xp int not null default 0,
  streak int not null default 0,
  chests_week int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Quien tenga cuenta ve el ranking; cada uno solo crea y cambia su propio perfil.
create policy "ver el ranking" on public.profiles for select to authenticated using (true);
create policy "crear mi perfil" on public.profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "cambiar mi perfil" on public.profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- El ranking se actualiza en directo.
alter publication supabase_realtime add table public.profiles;
