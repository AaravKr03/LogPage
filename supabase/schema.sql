-- V1YKsBuilds · Phase 2 · usernames for registered users
-- Run once: Supabase Dashboard -> SQL Editor -> paste -> Run.
-- Passwords are handled entirely by Supabase Auth (auth.users). Nothing here stores them.

create schema if not exists private;  -- not exposed through the Data API

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

alter table public.profiles enable row level security;

-- Signed-in users may read only their own row. No insert/update/delete from the client.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- Creates the profile row when someone registers. The username is only copied for display;
-- never use user_metadata for authorization decisions.
create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
