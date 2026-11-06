-- Pega esto en Supabase → SQL Editor → New query → Run.
-- Crea la tabla donde se guarda el progreso, una fila por usuario.
create table if not exists public.saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

-- Cada usuario solo puede ver y cambiar su propia fila.
alter table public.saves enable row level security;

create policy "leer lo mío" on public.saves for select using (auth.uid() = user_id);
create policy "crear lo mío" on public.saves for insert with check (auth.uid() = user_id);
create policy "cambiar lo mío" on public.saves for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Avisos en directo cuando cambia desde otro dispositivo.
alter publication supabase_realtime add table public.saves;
