-- Foto y personaje de cada jugador en el ranking. Pega esto en Supabase → SQL Editor → New query → Run.
alter table public.profiles add column if not exists photo text check (photo is null or length(photo) < 100000);
alter table public.profiles add column if not exists look jsonb;

-- Rutinas compartidas: cada uno publica sus rutinas para que sus amigos puedan verlas y copiarlas
alter table public.profiles add column if not exists routines jsonb;
