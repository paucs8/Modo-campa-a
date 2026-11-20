-- Muro de actividad: logros de cada jugador y reacciones (🔥 💪 👏).
-- Pega esto en Supabase → SQL Editor → New query → Run.

create table if not exists public.feed (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null default '',
  kind text not null default 'level',
  text text not null check (char_length(text) between 1 and 200),
  created_at timestamptz not null default now()
);
create index if not exists feed_created_idx on public.feed (created_at desc);

create table if not exists public.feed_reactions (
  feed_id bigint not null references public.feed (id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  emoji text not null check (emoji in ('🔥', '💪', '👏')),
  created_at timestamptz not null default now(),
  primary key (feed_id, user_id, emoji)
);

alter table public.feed enable row level security;
alter table public.feed_reactions enable row level security;

drop policy if exists "ver muro" on public.feed;
drop policy if exists "publicar en el muro" on public.feed;
drop policy if exists "borrar lo mio del muro" on public.feed;
create policy "ver muro" on public.feed for select to authenticated using (true);
create policy "publicar en el muro" on public.feed for insert to authenticated with check (auth.uid() = user_id);
create policy "borrar lo mio del muro" on public.feed for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "ver reacciones" on public.feed_reactions;
drop policy if exists "reaccionar" on public.feed_reactions;
drop policy if exists "quitar reaccion" on public.feed_reactions;
create policy "ver reacciones" on public.feed_reactions for select to authenticated using (true);
create policy "reaccionar" on public.feed_reactions for insert to authenticated with check (auth.uid() = user_id);
create policy "quitar reaccion" on public.feed_reactions for delete to authenticated using (auth.uid() = user_id);

-- Que se actualice en directo
do $$ begin
  alter publication supabase_realtime add table public.feed;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.feed_reactions;
exception when duplicate_object then null; end $$;
