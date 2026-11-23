-- Personajes ilustrados: los jugadores los piden desde la app y el ordenador de Pau los genera con ComfyUI.
-- Pega esto en Supabase → SQL Editor → New query → Run (necesita que ya exista public.is_admin(), del buzón de ideas).

create table if not exists public.avatar_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null default '',
  spec jsonb not null default '{}',
  prompt text not null check (char_length(prompt) between 5 and 1500),
  cost int not null default 0 check (cost between 0 and 500),
  status text not null default 'pendiente' check (status in ('pendiente', 'generando', 'listo', 'error')),
  image_url text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.avatar_requests enable row level security;
drop policy if exists "ver mis personajes" on public.avatar_requests;
drop policy if exists "pedir personaje" on public.avatar_requests;
drop policy if exists "generar personajes" on public.avatar_requests;
create policy "ver mis personajes" on public.avatar_requests for select to authenticated using (auth.uid() = user_id or public.is_admin());
create policy "pedir personaje" on public.avatar_requests for insert to authenticated
  with check (auth.uid() = user_id and status = 'pendiente' and image_url is null);
create policy "generar personajes" on public.avatar_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Sitio donde se guardan las imágenes (público para poder verlas en la app; solo el admin sube)
insert into storage.buckets (id, name, public) values ('avatares', 'avatares', true) on conflict (id) do nothing;
drop policy if exists "ver avatares" on storage.objects;
drop policy if exists "subir avatares" on storage.objects;
drop policy if exists "cambiar avatares" on storage.objects;
create policy "ver avatares" on storage.objects for select using (bucket_id = 'avatares');
create policy "subir avatares" on storage.objects for insert to authenticated with check (bucket_id = 'avatares' and public.is_admin());
create policy "cambiar avatares" on storage.objects for update to authenticated using (bucket_id = 'avatares' and public.is_admin());
