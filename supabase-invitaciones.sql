-- Invitaciones: gastas monedas y el amigo que elijas te invita a algo (café, desayuno, cine, cena…).
-- Pega esto en Supabase → SQL Editor → New query → Run.

create table if not exists public.vouchers (
  id bigint generated always as identity primary key,
  from_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  to_id uuid not null references auth.users (id) on delete cascade,
  from_name text not null default '',
  to_name text not null default '',
  reward text not null,
  cost int not null check (cost between 0 and 100000),
  status text not null default 'pending' check (status in ('pending', 'done', 'declined')),
  created_at timestamptz not null default now(),
  done_at timestamptz,
  check (from_id <> to_id)
);

alter table public.vouchers enable row level security;
drop policy if exists "ver mis invitaciones" on public.vouchers;
drop policy if exists "canjear invitacion" on public.vouchers;
drop policy if exists "responder invitacion" on public.vouchers;
create policy "ver mis invitaciones" on public.vouchers for select to authenticated using (auth.uid() in (from_id, to_id));
create policy "canjear invitacion" on public.vouchers for insert to authenticated with check (auth.uid() = from_id and status = 'pending');
-- Solo quien tiene que invitar marca si lo ha hecho o si no puede
create policy "responder invitacion" on public.vouchers for update to authenticated using (auth.uid() = to_id) with check (auth.uid() = to_id);

do $$ begin alter publication supabase_realtime add table public.vouchers; exception when duplicate_object then null; end $$;
