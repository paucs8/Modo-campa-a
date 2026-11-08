-- Buzón de ideas: cualquiera con cuenta manda sugerencias, solo quien lleva la app las acepta o descarta.
-- 1) Cambia TU_EMAIL por el email con el que entras en la app (abajo del todo).
-- 2) Pega esto en Supabase → SQL Editor → New query → Run.

create table if not exists public.suggestions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null default '',
  kind text not null default 'otro',
  text text not null check (char_length(text) between 3 and 600),
  status text not null default 'pendiente' check (status in ('pendiente', 'aceptada', 'rechazada', 'hecha')),
  reply text,
  created_at timestamptz not null default now()
);

-- Quién puede decidir (tú)
create table if not exists public.admins (user_id uuid primary key references auth.users (id) on delete cascade);
alter table public.admins enable row level security;
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public
  as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
grant execute on function public.is_admin() to authenticated;

alter table public.suggestions enable row level security;
drop policy if exists "ver ideas" on public.suggestions;
drop policy if exists "mandar idea" on public.suggestions;
drop policy if exists "decidir ideas" on public.suggestions;
drop policy if exists "borrar idea" on public.suggestions;
create policy "ver ideas" on public.suggestions for select to authenticated using (true);
create policy "mandar idea" on public.suggestions for insert to authenticated
  with check (auth.uid() = user_id and status = 'pendiente' and reply is null);
create policy "decidir ideas" on public.suggestions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "borrar idea" on public.suggestions for delete to authenticated
  using (public.is_admin() or (auth.uid() = user_id and status = 'pendiente'));

-- Te hace admin a ti
insert into public.admins (user_id)
  select id from auth.users where email = 'TU_EMAIL'
  on conflict do nothing;
